<?php

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Получение данных из формы
    $name = isset($_POST["name"]) ? htmlspecialchars(trim($_POST["name"])) : "";
    $site = isset($_POST["site"]) ? htmlspecialchars(trim($_POST["site"])) : "";
    $phone = isset($_POST["phone"]) ? htmlspecialchars(trim($_POST["phone"])) : "";

    // Проверка наличия данных
    if (!empty($name) && !empty($phone)) {
        // Сбор данных для лога
        $logData = date("Y-m-d H:i:s") . " - Имя: $name, Сайт компании: $site, Телефон: $phone\n";

        // Путь к каталогу для лог-файлов
        $logDirectory = "log/";

        // Создание каталога, если его нет
        if (!is_dir($logDirectory)) {
            mkdir($logDirectory, 0755, true);
        }

        // Путь к файлу лога
        $logFilePath = $logDirectory . "file.txt";

        // Запись данных в лог-файл
        file_put_contents($logFilePath, $logData, FILE_APPEND);

        // Отправка данных в базу данных или выполнение других операций

        // Ответ на успешную обработку
        echo json_encode(["success" => true, "message" => "Данные успешно обработаны."]);
        exit;
    } else {
        // Ответ при отсутствии необходимых данных
        echo json_encode(["success" => false, "message" => "Не все обязательные поля заполнены."]);
        exit;
    }
} else {
    // Ответ на некорректный тип запроса
    echo json_encode(["success" => false, "message" => "Некорректный тип запроса."]);
    exit;
}
