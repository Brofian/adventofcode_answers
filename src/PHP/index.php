<?php

$rootDirectory = __DIR__ . '/../../';

spl_autoload_register(static function ($class_name) use ($rootDirectory) {
    require_once $rootDirectory . str_replace('\\', '/', $class_name) . '.php';
});

include __DIR__ . '/functions.php';

$controller = new \src\PHP\Controller($argv[1] ?? '', $argv[2] ?? '', $argv[3] ?? '');
$controller->init();