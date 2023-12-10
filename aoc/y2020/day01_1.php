<?php

namespace aoc\y2020;

use src\PHP\AbstractRiddle;

class day01_1 extends AbstractRiddle {

    public function getRiddleDescription(): string
    {
        return 'Find the two entries that sum to 2020; what do you get if you multiply them together?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day01.txt', (function($line) {return (int)trim($line);}));


        $solution = null;
        foreach($lines as $line) {
            foreach($lines as $line2) {
                if($line+$line2 == 2020) {
                    $solution = $line*$line2;
                    break;
                }
            }
            if($solution !== null) {
                break;
            }
        }

        return "$solution";
    }

}