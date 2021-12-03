<?php

namespace src;

abstract class AbstractRiddle {

    abstract public function getRiddleDescription(): string;

    abstract public function getRiddleAnswer(): string;

    protected function readLinesOfFile(string $filepath, callable $mapFunc = null): array {
        $lines = @file($filepath);

        if($lines === false) {
            IO::printError('   > The given path does not exist: ' . str_replace('/', DIRECTORY_SEPARATOR, $filepath));
            die();
        }

        $callback = $mapFunc ?? function($line) {
            return trim($line);
        };
        $lines = array_map($callback, $lines);

        return $lines;
    }



}