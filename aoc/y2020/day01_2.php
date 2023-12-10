<?php

namespace aoc\y2020;

use src\PHP\AbstractRiddle;

class day01_2 extends AbstractRiddle {

    public function getRiddleDescription(): string
    {
        return 'What is the product of the three entries that sum to 2020?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day01.txt', (function($line) {return (int)trim($line);}));


        $solution = null;
        foreach($lines as $line) {
            foreach($lines as $line2) {
                foreach($lines as $line3) {
                    if($line+$line2+$line3 == 2020) {
                        $solution = $line*$line2*$line3;
                        break;
                    }
                }
                if($solution !== null) {
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