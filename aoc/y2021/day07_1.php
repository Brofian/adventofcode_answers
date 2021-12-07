<?php

namespace aoc\y2021;

use src\AbstractRiddle;
use src\Stopwatch;

class day07_1 extends AbstractRiddle {

    public function getRiddleDescription(): string
    {
        return 'How much fuel must they spend to align to that position?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day07.txt', (function($line) {
            $line = trim($line);
            return array_map(function ($item) {return (int)$item;}, explode(',', $line));
        }));
        $crabPositions = array_shift($lines);


        $min = min($crabPositions);
        $max = max($crabPositions);
        $costs = [];
        for($i = $min; $i <= $max; $i++) {
            $costs[$i] = 0;

            foreach($crabPositions as $crabPosition) {
                $costs[$i] += abs($crabPosition-$i);
            }
        }

        return min($costs);
    }


}