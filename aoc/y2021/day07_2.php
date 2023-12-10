<?php

namespace aoc\y2021;

use src\PHP\AbstractRiddle;

class day07_2 extends AbstractRiddle {

    protected array $numberSumList = [];

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

        $currentMin = PHP_INT_MAX;
        for($i = min($crabPositions); $i <= max($crabPositions); $i++) {
            $costs = 0;
            foreach($crabPositions as $crabPosition) {
                $costs += $this->calculateCosts(abs($crabPosition-$i));
                if($costs > $currentMin) {
                    break;
                }
            }

            if($costs < $currentMin) {
                $currentMin = $costs;
            }
        }

        return $currentMin;
    }

    protected function calculateCosts(int $number): int {
        if(!isset($this->numberSumList[$number])) {
            //calculate and cache
            $this->numberSumList[$number] = ($number * ($number+1)) / 2;
        }

        return $this->numberSumList[$number];
    }



}