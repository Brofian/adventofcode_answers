<?php

namespace aoc\y2022;

use src\PHP\AbstractRiddle;

class day03_1 extends AbstractRiddle {

    public function getRiddleDescription(): string
    {
        return 'What is the sum of the priorities of those item types?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day03.txt', (static function($line) {return trim($line);}));

        $priorities = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $sum = 0;

        foreach($lines as $line) {
            $itemCount = strlen($line);
            $firstHalf = substr($line, 0, $itemCount/2);
            $secondHalf = substr($line, $itemCount/2);

            $commonLetters = array_intersect(str_split($firstHalf), str_split($secondHalf));
            $commonLetter = reset($commonLetters);
            $letterValue = strpos($priorities, $commonLetter) + 1;

            $sum += $letterValue;
        }


        return "$sum";
    }

}