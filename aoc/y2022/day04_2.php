<?php

namespace aoc\y2022;

use src\PHP\AbstractRiddle;

class day04_2 extends AbstractRiddle {

    public function getRiddleDescription(): string
    {
        return 'In how many assignment pairs do the ranges overlap?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day04.txt', (static function($line) {return trim($line);}));

        $sum = 0;

        foreach($lines as $line) {
            preg_match('/(\d+)-(\d+),(\d+)-(\d+)/', $line, $data);

            $a = $data[1] <= $data[3] && $data[2] >= $data[3];
            $b = $data[1] <= $data[4] && $data[2] >= $data[4];
            $c = $data[3] <= $data[1] && $data[4] >= $data[1];
            $d = $data[3] <= $data[2] && $data[4] >= $data[2];

            $sum += ($a||$b||$c||$d) ? 1 : 0;
        }

        return "$sum";
    }

    protected function regionsOverlap(array $reg1, array $reg2): bool {
        $a = $reg1[0] <= $reg2[0] && $reg1[1] >= $reg2[0];
        $b = $reg1[0] <= $reg2[1] && $reg1[1] >= $reg2[1];
        $c = $reg2[0] <= $reg1[0] && $reg2[1] >= $reg1[0];
        $d = $reg2[0] <= $reg1[1] && $reg2[1] >= $reg1[1];


        return $a || $b || $c || $d;
    }

}