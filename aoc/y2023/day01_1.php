<?php

namespace aoc\y2023;

use src\PHP\AbstractRiddle;

class day01_1 extends AbstractRiddle {



    public function getRiddleDescription(): string
    {
        return 'Combine the first and the last digit occurring in each line and sum them up';
    }

    public function getRiddleAnswer(): string
    {
        $lines = file(__DIR__ . '/files/day01.txt');

        $sum = 0;

        foreach ($lines as $line) {
            preg_match('/^\D*(\d)/', $line, $matchesLeft);
            preg_match('/.*(\d)\D*$/', $line, $matchesRight);
            $sum += (int)($matchesLeft[1].$matchesRight[1]);
        }

        return $sum;
    }

}