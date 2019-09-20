<?php

if (!empty($_POST)) {

    $response = [];

    if ($_POST) {
        $input['name'] = isset($_POST['name']) ? $_POST['name'] : '';
        $input['email'] = isset($_POST['email']) ? $_POST['email'] : '';
        $input['text'] = isset($_POST['text']) ? $_POST['text'] : '';
        $input['radio'] = isset($_POST['radio']) ? $_POST['radio'] : '';
        $input['checkbox'] = isset($_POST['checkbox']) ? $_POST['checkbox'] : '';

        /*
         * input type = text
         */
        if (!$input['name'])
            $response['errors']['name'] = 'Поле "Name" обязательно к заполнению';

        if (!$input['email'])
            $response['errors']['email'] = 'Поле "Email" обязательно к заполнению';

        if (!$input['text'])
            $response['errors']['text'] = 'Поле "Textarea" обязательно к заполнению';

        if (!$input['radio'])
            $response['errors']['radio'] = 'Поле "Radio" обязательно к заполнению';

        if (!$input['checkbox'])
            $response['errors']['checkbox'] = 'Нужно выбрать хотябы одно поле';

        if (count($response['errors']) > 0) {
            $response['status'] = 'errorValid';
            $response['msg'] = 'Заполните все обязательные поля';

        } else
            $response = [
                'status' => 'msg',
                'msg' => 'Валидация прошла успешно'

            ];
    }

    $response = [
        'status' => 'script',
        'script' => 'alert(32)'
    ];

    exit(json_encode($response));
}