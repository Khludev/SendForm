#  SendForm
> Для отправки формы Ajax   достаточно  повесть клас скрипта на submit

#### Оисание скрипта
Даный скрипт предназаначет для однообразной рутинной ajax отправки форм на сервер и вывода ошибок. 


Замечу что валидация в даном случае проводиться на стороне сервера который отправляет определенный статус и действие для скрипта.

Скрип используеться в личных целях и значит будет обновляться по мере необходимости

## Подключение

Для роботы скрипта необходимо подключить Jquery 3х версий и сам скрипт **kdev-sendForm.js**

Для вывода уведомлений я использую пару тройку стилей которые, если вы не сжимаете все в один файл, лучше скопировать из файла **kdev-sendForm.css** в свой файл и при необходимости изменить на свой вкус.

##### CSS

```html
<link rel="stylesheet" href="/css/kdev-sendForm.css">
```

##### JS

```html
<script src="/js/jquery.3.3.1.min.js"></script>
<script src="/js/kdev-sendForm.js"></script>
```

##### PACKAGE MANAGERS
###### Bower
` bower install --save slick-carousel `

###### NPM
`npm i kdev-sendform`

Пример HTML формы

```html
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

Теперь вешаем на кнопку отправки формы обработчик **kdevSendForm**

```javascript
$('.send-form').kdevSendForm();
```

#### Ответ сервера
##### Ошибка валидации
Если данные не прошли валидацию вернем статус **"errorValid"** и ошибки в масиве 'error'

```php
$response = [
        'status' => 'errorValid',
        'errors' =>
            [
                ['name'] => 'Поле "Name" обязательно к заполнению',
                ['email'] => 'Поле "Email" обязательно к заполнению'
            ],
        'msg' => 'Заполните все обязательные поля'
    ];
exit(json_encode($response));
```
В етом случае под всеми полями для которых мы вернули ошибки отобразяться поля с ошибками.

##### Ошибка валидации + всплывающее уведомление
Если мы хотим еще показать всплывающее уведомление мы можем вернуть еще и текст сообщения например 'Заполните все обязательные поля'

```php
$response = [
        'status' => 'errorValid',
        'errors' =>
            [
                ['name'] => 'Поле "Name" обязательно к заполнению',
                ['email'] => 'Поле "Email" обязательно к заполнению'
            ],
        'msg' => 'Заполните все обязательные поля'
    ];
exit(json_encode($response));
```
##### Текстовое сообщение

```php
$response = [
        'status' => 'msg',
        'msg' => 'Заполните все обязательные поля'
    ];
exit(json_encode($response));
```
##### Возвращаем redirect

```php
$response = [
        'status' => 'redirect',
        'url' => '/home'
    ];
exit(json_encode($response));
```
##### Всплывающее сообщение об ошибке

```php
$response = [
        'status' => 'errors',
        'msg' => 'Непредвиденная ошибка!'
    ];
exit(json_encode($response));
```
##### Сallback функция
Если мы хотим вызвать свою какую нибуть callback функцию

```php
$response = [
        'status' => 'callback',
        'function' => 'functionName'
    ];
exit(json_encode($response));
```
