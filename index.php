<?php

spl_autoload_register(function ($class_name) {
    require_once $class_name . '.php';
});

include __DIR__ . '/src/functions.php';

$controller = new \src\Controller($argv[1] ?? '', $argv[2] ?? '', $argv[3] ?? '');
$controller->init();