<?php

namespace aoc\y2021;

use src\PHP\AbstractRiddle;

class day01_1 extends AbstractRiddle {

    public function getRiddleDescription(): string
    {
        return 'How many measurements are larger than the previous measurement?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day01.txt', (function($line) {return (int)trim($line);}));

        $largerThanPrevious = 0;
        for($i = 1; $i < count($lines); $i++) {
            $prev = $lines[$i-1];
            $current = $lines[$i];

            $largerThanPrevious += (int)($current > $prev);
        }

        return "$largerThanPrevious";
    }

}