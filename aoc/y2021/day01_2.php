<?php

namespace aoc\y2021;

use src\PHP\AbstractRiddle;

class day01_2 extends AbstractRiddle {

    public function getRiddleDescription(): string
    {
        return 'Count the number of times the sum of measurements in this sliding window increases';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day01.txt', (function($line) {return (int)trim($line);}));

        $sums = [];
        for($i = 0; $i < count($lines)-2; $i++) {
            $sums[] = $lines[$i] + $lines[$i+1] + $lines[$i+2];
        }


        $largerThanPrevious = 0;
        for($i = 1; $i < count($sums); $i++) {
            $prev = $sums[$i-1];
            $current = $sums[$i];

            $largerThanPrevious += (int)($current > $prev);
        }

        return $largerThanPrevious;
    }
}