**SendForm** v 1.0.0
====


Оисание скрипта
====
**Установка**

//

**Подключение**

Для роботы скрипта необходимо подключить Jquery 3х версий

CSS

```html
<link rel="stylesheet" href="/css/kdev-sendForm.css">

```

JS
```html
<script src="/js/jquery.3.3.1.min.js"></script>

<script src="path/to/validate.polyfills.min.js"></script>

```
Пример HTML формы

```
<form action="./form.php" method="post">
    <div class="form-item">
        <label>Name
            <br>
            <input type="text" name="name">
        </label>
    </div>
    <div class="form-item">
        <input type="button" class="send-form" value="send">
    </div>
</form>
```

Теперь вешаем на кнопку отправки формы обработчик kdevSendForm

```
$('.send-form').kdevSendForm();
```

Ответ сервера
===

Если **данные не прошли валидацию** вернем статус _"errorValid"_ и ошибки в масиве _'error'_

```
$response = [
        'status' => 'errorValid',
        'error' =>
            [
                ['name'] => 'Поле "Name" обязательно к заполнению',
                ['email'] => 'Поле "Email" обязательно к заполнению'
            ],
        'msg' => 'Заполните все обязательные поля'
    ];
    
exit(json_encode($response));
```
В етом случае под всеми полями для которых мы вернули ошибки отобразяться поля с ошибками.

Если мы хотим еще показать всплывающее уведомление мы можем вернуть еще и текст сообщения например _'Заполните все обязательные поля'_

```
$response = [
        'status' => 'errorValid',
        'error' =>
            [
                ['name'] => 'Поле "Name" обязательно к заполнению',
                ['email'] => 'Поле "Email" обязательно к заполнению'
            ],
        'msg' => 'Заполните все обязательные поля'
    ];
    
exit(json_encode($response));
```

Также мы можем вернуть текстовое **сообщение**

```
$response = [
        'status' => 'msg',
        'msg' => 'Заполните все обязательные поля'
    ];
    
exit(json_encode($response));
```

Возвращаем **redirect** 


```
$response = [
        'status' => 'redirect',
        'url' => '/home'
    ];
    
exit(json_encode($response));
```

Возвращаем всплывающее **сообщение об ошибке** 


```
$response = [
        'status' => 'error',
        'msg' => 'Непредвиденная ошибка!'
    ];
    
exit(json_encode($response));
```

Если мы хотим вызвать свою какую нибуть **callback функцию** 

```
$response = [
        'status' => 'callback',
        'function' => 'functionName'
    ];
    
exit(json_encode($response));
```