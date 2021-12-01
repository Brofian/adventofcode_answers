<?php

require 'src/autoload.php';
require 'src/Controller.php';

$controller = new \src\Controller($argv[1] ?? '', $argv[2] ?? '');
$controller->init();