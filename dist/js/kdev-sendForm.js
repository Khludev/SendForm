(function ($) {

    var settings = {
            ajaxAsync: true,
            //Класс для врапера ошибок валидации
            errorClass: 'error-valid',
            //Время отображения ошибки ms
            popTime: 4000,
            //Елемент для вывода ошибок валидации
            wrapElement: 'span',
            //Метод отправки формы по умолчанию
            method: 'POST',
            //Url формы по умолчанию
            url: '/'
        },
        data = {
            //Пришедшие данные из сервера
            resultServer: {},
            //Форма которая обрабатываеться
            htmlForm: '',
            //Поп-ап блок вывода уведомлений
            sendInfo: $('<span id="send-form-info"></span>') //Всплывающий блок для сообщений
        };
    // Существующие статусы для сервера
    // А так же используем как имя класса статуса поп-ап сообщения
    const
        STATUS_SUCCESS = 'success',
        STATUS_ERROR = 'error',
        STATUS_ERROR_VALID = 'errorValid',
        STATUS_CALLBACK = 'callback',
        STATUS_MSG = 'msg',
        STATUS_REDIRECT = 'redirect',
        STATUS_CONTENT = 'content',
        STATUS_SCRIPT = 'script'
    ;

    var
        methods = {
            // Сохраняем переданные настройки
            init: function (clickBut, option) {
                $.extend(settings, option);

                return $(clickBut).each(function () {
                    $(this).click(function (e) {
                        methods.kdevSendForm($(this), e);

                    });
                });
            },
            //Показать ошибки в консоли
            printSetting() {
                console.log(settings);

            },
            //Поместить ошибки в блок для ошибок
            wrapError: function (text) {
                return $(document.createElement(settings.wrapElement)).addClass(settings.errorClass).html(text);

            },
            //Удалить все выведенные ошибки
            removeError: function () {
                data.htmlForm.find('.' + settings.errorClass).remove();
            },
            //Показать ошибки
            setErrorValid: function () {

                this.removeError();

                if (data.resultServer.errorClass)
                    settings.errorClass = data.resultServer.errorClass;

                if (data.resultServer.msg)
                    this.pop();

                for (item in data.resultServer.errors) {
                    if (data.resultServer.errors[item] != undefined) {
                        data.htmlForm.find('[name="' + item + '"]').last().after(methods.wrapError(data.resultServer.errors[item])).length;

                    }
                }
            },
            //Вставить html. Принимаем jquery метод before, html или другие
            insertContent: function (data) {
                let method = data.method ? data.method : 'html';
                try {
                    $(data.selector)[method](data.content)

                } catch (e) {
                    this.error(e);
                }
            },
            //Показать поп-ап уведомление
            pop: function ($htmMsg) {
                if (!$htmMsg)
                    $htmMsg = this.renderHtmlMessage();

                data.sendInfo.html($htmMsg);

                $('body').prepend(data.sendInfo);
                //Покажем сообщение
                data.sendInfo.animate({
                    'opacity': 1
                }, 200);
                //Скроем сообщение через заданое время
                setTimeout(function () {
                    data.sendInfo.animate({
                        'opacity': 0
                    }, 200);
                }, settings.popTime)

            },
            //Рендерим HTML контент уведомления из полученых даных от серевера
            renderHtmlMessage: function () {
                if (data.resultServer.status) {
                    this.removeError();

                    switch (data.resultServer.status) {
                        //Вывод поп-ап для статус STATUS_SUCCESS
                        case STATUS_SUCCESS:
                            //Удлим все классы и добавим нужный
                            data.sendInfo.removeClass();
                            data.sendInfo.addClass(STATUS_SUCCESS);

                            if (data.resultServer.msg)
                                return this.pop(data.resultServer.msg);

                            return this.pop(data.resultServer.msg);

                        //Вывод поп-ап для статус STATUS_ERROR_VALID и STATUS_ERROR
                        case STATUS_ERROR:
                        case STATUS_ERROR_VALID:
                            //Удлим все классы и добавим нужный
                            data.sendInfo.removeClass();
                            data.sendInfo.addClass(STATUS_ERROR);

                            if (data.resultServer.msg)
                                return this.pop(data.resultServer.msg);

                            return this.pop(data.resultServer.msg);

                        case 'msg':
                            //Удлим все классы и добавим нужный
                            data.sendInfo.removeClass();
                            data.sendInfo.addClass(STATUS_MSG);

                            return this.pop(data.resultServer.msg);

                    }
                }
            },
            //Получаем данные формы и отправляем на сервер
            kdevSendForm: function (e, jsObj) {
                $(e).css('cursor', 'progress');
                jsObj.preventDefault();
                e.prop('disabled', true);
                data.htmlForm = e.closest('form');
                data.formData = data.htmlForm.serialize();
                settings.url = data.htmlForm.attr("action");
                settings.method = data.htmlForm.attr('method');
                var self = this;

                $.ajax({
                    type: settings.method,
                    url: settings.url,
                    data: data.formData,
                    async: settings.ajaxAsync,
                    dataType: 'json',
                    success: function (result) {

                        data.resultServer = result;

                        switch (result.status) {
                            //Уведомление об ошибки выполнении или "Error!" по умолчанию
                            case STATUS_ERROR:
                                self.pop();
                                break;

                            //Уведомление об успешном выполнении или "Success!" по умолчанию
                            case STATUS_SUCCESS:
                                self.pop();
                                break;

                            //Выводим ошибки
                            case STATUS_ERROR_VALID:
                                methods.setErrorValid();
                                break;

                            //Вызов функции callback
                            case STATUS_CALLBACK:
                                window[result.function](result);
                                break;

                            //Выводим сообщение
                            case STATUS_MSG:
                                self.pop();
                                break;

                            //Редиректим на url
                            case STATUS_REDIRECT:
                                window.location = result.url;
                                break;

                            //Вставить html елемент 
                            case STATUS_CONTENT:
                                self.insertContent(result);
                                break;

                            //Выполнить js скрипт (eval)
                            case STATUS_SCRIPT:
                                eval(result.script);
                                break;

                        }
                        e.prop('disabled', false);
                        $(e).css('cursor', 'auto');
                    }
                });

                return false;
            },
            error: function (e) {
                console.log('kdev-sendForm error -> ', e.message, e.name);
            }

        };

    $.fn.kdevSendForm = function (action) {
        if (methods[action]) {
            return methods[action].apply(this, Array.prototype.slice.call(settings, 1))
        } else if (typeof action === 'object' || !action) {
            return methods.init(this, settings)

        } else {
            console.log('Error not `' + action + '` method from plugin kdevSendForm');
        }
    }
})(jQuery);
