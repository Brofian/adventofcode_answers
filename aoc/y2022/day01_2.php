<?php

namespace aoc\y2022;

use src\AbstractRiddle;

class day01_2 extends AbstractRiddle {

    public function getRiddleDescription(): string
    {
        return 'How many Calories are those Elves carrying in total?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day01.txt', (static function($line) {return (int)trim($line);}));

        $maxCals = [];
        $currentCals = 0;
        foreach($lines as $line) {
            if($line === 0) {
                $maxCals[] = $currentCals;
                $currentCals = 0;
                continue;
            }

            $currentCals += (int)$line;
        }
        rsort($maxCals);

        $total = $maxCals[0] + $maxCals[1] + $maxCals[2];
        return "$total";
    }

}