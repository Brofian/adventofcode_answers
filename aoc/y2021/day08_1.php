<?php

namespace aoc\y2021;

use src\AbstractRiddle;
use src\Stopwatch;

class day08_1 extends AbstractRiddle {

    public function getRiddleDescription(): string
    {
        return 'In the output values, how many times do digits 1, 4, 7, or 8 appear?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day08.txt', (function($line) {
            list($numbers, $outputs) = explode('|', trim($line));
            return [
                'numbers' => explode(' ', trim($numbers)),
                'outputs' => explode(' ', trim($outputs))
            ];
        }));

        // numbers is an array of 10 strings, that correspond to the codes for 0 through 9
        // outputs is an array of 4 strings, that correspond to the actual output values, we want to decipher


        $decipherableOutputs = 0;
        foreach($lines as $line) {
            $decipherableOutputs += $this->countDecipherableNumbers($line['outputs']);
        }


        return $decipherableOutputs;
    }


    /*
     * 0 => 8 |
     * 1 => 2 | unique
     * 2 => 5 |
     * 3 => 5 |
     * 4 => 4 | unique
     * 5 => 5 |
     * 6 => 5 |
     * 7 => 3 | unique
     * 8 => 7 | unique
     * 9 => 8 |
     */
    protected function countDecipherableNumbers(array $numbers): int {
        $sum = 0;
        foreach($numbers as $number) {
            if(in_array(strlen($number), [2,3,4,7])) {
                $sum++;
            }
        }

        return $sum;
    }

}