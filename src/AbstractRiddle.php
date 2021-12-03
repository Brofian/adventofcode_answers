<?php

namespace src;

abstract class AbstractRiddle {

    abstract function getRiddleDescription(): string;

    abstract function getRiddleAnswer(): string;

    protected function readLinesOfFile(string $filepath): array {
        $lines = file(__DIR__ . '/files/day01.txt');
        $lines = array_map(function($line) {
            return (int)trim($line);
        }, $lines);

        return $lines;
    }

}