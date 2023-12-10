<?php

namespace aoc\y2022;

use src\PHP\AbstractRiddle;

class day01_1 extends AbstractRiddle {

    public function getRiddleDescription(): string
    {
        return 'How many total Calories is that Elf carrying?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day01.txt', (static function($line) {return (int)trim($line);}));

        $maxCals = 0;
        $currentCals = 0;
        foreach($lines as $line) {
            if($line === 0) {
                $maxCals = max($maxCals, $currentCals);
                $currentCals = 0;
                continue;
            }

            $currentCals += (int)$line;
        }

        return "$maxCals";
    }

}