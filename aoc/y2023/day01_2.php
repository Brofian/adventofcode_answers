<?php

namespace aoc\y2023;

use src\PHP\AbstractRiddle;

class day01_2 extends AbstractRiddle {



    public function getRiddleDescription(): string
    {
        return 'Combine the first and the last digit (written or numeric) in each line and sum them up';
    }

    public function getRiddleAnswer(): string
    {
        $lines = file(__DIR__ . '/files/day01.txt');

        $sum = 0;

        $numberStrings = [
            'one',
            'two',
            'three',
            'four',
            'five',
            'six',
            'seven',
            'eight',
            'nine'
        ];
        $stringNumbers = array_flip($numberStrings);

        $regexMatch = implode('|', $numberStrings) . '|\d';

        foreach ($lines as $line) {
            preg_match_all('/(?=(' . $regexMatch . '))/', $line, $matches);

            $first = $matches[1][0];
            if (!is_numeric($first)) {
                $first = $stringNumbers[$first] + 1;
            }
            $second = $matches[1][count($matches[1])-1];
            if (!is_numeric($second)) {
                $second = $stringNumbers[$second] + 1;
            }
            $sum += (int)($first . $second);
        }

        return $sum;
    }

}