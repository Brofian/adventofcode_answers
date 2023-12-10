<?php

namespace aoc\y2021;

use src\PHP\AbstractRiddle;

class day03_1 extends AbstractRiddle {


    public function getRiddleDescription(): string
    {
        return 'What is the power consumption of the submarine?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day03.txt');

        $binaryNumbers = array_map(function ($item) {
            $bits = str_split($item);
            return $bits;
        }, $lines);


        $mostCommonBits = [];
        for($i = 0; $i < 12; $i++) {
            $mostCommonBits[] = $this->getMostCommonBit(array_column($binaryNumbers, $i));
        }

        $gamma = implode('', $mostCommonBits);

        $leastCommonBits = array_map(function($item) {
            return $item ? 0 : 1;
        }, $mostCommonBits);

        $epsilon = implode('', $leastCommonBits);


        return "gamma: $gamma, epsilon: $epsilon, total: " . (bindec($gamma)*bindec($epsilon));
    }

    protected function getMostCommonBit(array $bits): int {
        $cond = 0;

        foreach($bits as $bit) {
            $cond += $bit ? 1 : -1;
        }

        return (int)($cond > 0);
    }





}