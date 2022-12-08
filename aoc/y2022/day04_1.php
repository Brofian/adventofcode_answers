<?php

namespace aoc\y2022;

use src\AbstractRiddle;

class day04_1 extends AbstractRiddle {

    function getRiddleDescription(): string
    {
        return 'In how many assignment pairs does one range fully contain the other?';
    }

    function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day04.txt', (static function($line) {return trim($line);}));

        $sum = 0;

        foreach($lines as $line) {
            preg_match('/(\d+)-(\d+),(\d+)-(\d+)/', $line, $data);

            $firstContainsSecond = $data[1] <= $data[3] && $data[2] >= $data[4];
            $secondContainsFirst = $data[3] <= $data[1] && $data[4] >= $data[2];

            $sum += ($firstContainsSecond || $secondContainsFirst) ? 1 : 0;
        }


        return "$sum";
    }

}