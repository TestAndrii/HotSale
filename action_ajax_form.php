<?php
//  Массив пользователей из Базы данных.
$users = array(
    0 => array(
        'id' => 1,
        'email' => 'user@ua.fm',
        'name' => 'user',
        'password' => '123'
    ),
    1 => array(
        'id' => 2,
        'email' => 'master@user.com',
        'name' => 'master',
        'password' => '123'
    ),
);


if (isset($_POST["name"])) {

    // переменная для сохранения результата
    $data = '{';
    $hash = '';
    $data_array = [];
    // из массив $_POST получаем строку json
    foreach ($_POST as $key => $value) {
        if( $key == 'hash'){
            // Получаем хэш
            $hash = $value;
        } else {
        // добавим в переменную $data имя и значение ключа
        $data .= $key . ':' . $value . ',';
        $data_array[$key] = $value;
        }
    }
    $data .= '}';

    // Тестируем входные данные.
    $salt = '123';
    $test = ($hash == hashCalc($data, $salt)) ? "Данные приняты!" : "Ошибка в данных.";
    $test .= validate($data_array, $users);

    // Формируем массив для JSON ответа
    $result = array(
        'name' => $test, // Ответ
    );

    // Переводим массив в JSON
    echo json_encode($result);
}

// Получение хэша
function hashCalc($str, $salt)
{
    return $salt . $str;
}

// Валидачия Email & Passwords
function validate($data, $users)
{
    if (!strpos($data['email'],'@')){
        return "Неправильный Email - нет '@'";
    } elseif ($data['password'] != $data['password1']) {
        logs('Error: Пароли не совпадают: ' . $data['password'] .'!='. $data['password1'] );
        return '<div class="alert alert-danger" role="alert">Пароли не совпадают</div>';
    }

    foreach($users as $user){
        if($user['email'] == $data['email']) {
            logs('Error: Такой Email уже зарегистрирован: ' . $data['email']);
            return '<div class="alert alert-danger" role="alert">Такой Email уже зарегистрирован</div>';
        }

    }

    // добавлем нового пользователя в 'базу'
    $user_new = [
        'email' => $data['email'],
        'name' => $data['name'],
        'password' => $data['password']
    ];
    $users[] = $user_new;
    logs('Зарегистрирован пользователь: '. print_r($user_new,true));

    return "</br><div>".$data['email']."</div>";
}

// Логи
function logs($str_log){
    // Лог файл
    $file = fopen(__DIR__.'/php_ajax.log', 'a');
    fputs($file, $str_log . PHP_EOL);
    fclose($file);
}
?>