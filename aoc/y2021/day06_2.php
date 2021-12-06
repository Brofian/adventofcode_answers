<?php

namespace aoc\y2021;

use src\AbstractRiddle;
use src\Stopwatch;

class day06_2 extends AbstractRiddle {

    public function getRiddleDescription(): string
    {
        return 'How many lanternfish would there be after 256 days?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day06.txt', (function($line) {
            $line = trim($line);
            return array_map(function ($item) {return (int)$item;}, explode(',', $line));
        }));
        $ages = current($lines);

        $lanternFishes = [];
        foreach($ages as $age) {
            if(!isset($lanternFishes[$age])) {
                $lanternFishes[$age] = 1;
                continue;
            }
            $lanternFishes[$age]++;
        }


        $stopwatch = new Stopwatch();
        $stopwatch->start();
        for ($day = 0; $day < 256; $day++) {
            $lanternFishes = $this->simulateDay($lanternFishes);
        }
        $stopwatch->stop();

        return $this->getSumOfFish($lanternFishes) . ' -- calculated in ' . $stopwatch->toMs();
    }


    protected function getSumOfFish(array $lanternFishes): int {
        $sum = 0;
        for($i = 0; $i < 9; $i++) {
            $sum += $lanternFishes[$i]??0;
        }

        return $sum;
    }

    protected function simulateDay(array $lanternFishes): array {
        $nextGeneration = [];

        for($i = 0; $i < 9; $i++) {
            $nextGeneration[$i-1] = $lanternFishes[$i]??0;
        }

        if($nextGeneration[-1]??0) {
            $nextGeneration[8] = $nextGeneration[-1];
            $nextGeneration[6] += $nextGeneration[-1];
        }

        return $nextGeneration;
    }

}