<?php

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = isset($_POST["name"]) ? htmlspecialchars(trim($_POST["name"])) : "";
    $site = isset($_POST["site"]) ? htmlspecialchars(trim($_POST["site"])) : "";
    $phone = isset($_POST["phone"]) ? htmlspecialchars(trim($_POST["phone"])) : "";

    if (!empty($name) && !empty($phone)) {
        $logData = date("Y-m-d H:i:s") . " - Имя: $name, Сайт компании: $site, Телефон: $phone\n";

        $logDirectory = "logs/";

        if (!is_dir($logDirectory)) {
            mkdir($logDirectory, 0755, true);
        }

        $logFilePath = $logDirectory . "log.txt";

        file_put_contents($logFilePath, $logData, FILE_APPEND);

        echo json_encode(["success" => true, "message" => "Данные успешно обработаны."]);
        exit;
    } else {
        echo json_encode(["success" => false, "message" => "Не все обязательные поля заполнены."]);
        exit;
    }
} else {
    echo json_encode(["success" => false, "message" => "Некорректный тип запроса."]);
    exit;
}
