<?php

namespace aoc\y2022;

use src\PHP\AbstractRiddle;

class day03_2 extends AbstractRiddle {

    public function getRiddleDescription(): string
    {
        return 'What is the sum of the priorities of those item types?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day03.txt', (static function($line) {return trim($line);}));

        $priorities = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $sum = 0;

        for($i = 0; $i < $lineCount = count($lines); $i += 3) {
            $first  = str_split($lines[$i+0]);
            $second = str_split($lines[$i+1]);
            $third  = str_split($lines[$i+2]);

            $commonLetters = array_intersect($first,$second,$third);
            $commonLetter = reset($commonLetters);
            $letterValue = strpos($priorities, $commonLetter) + 1;

            $sum += $letterValue;
        }

        return "$sum";
    }

}