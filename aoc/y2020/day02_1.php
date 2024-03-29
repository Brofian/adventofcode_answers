<?php

namespace aoc\y2020;

use src\PHP\AbstractRiddle;

class day02_1 extends AbstractRiddle {

    public function getRiddleDescription(): string
    {
        return 'How many passwords are valid according to their policies?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day02.txt', (function($line) {return trim($line);}));

        $lines = array_map(function($line) {
            preg_match('/([0-9]*)-([0-9]*) (\w): (\w*)/m', $line, $matches);

            return [
                'min' => $matches[1],
                'max' => $matches[2],
                'char' => $matches[3],
                'value' => $matches[4],
            ];
        }, $lines);

        $solutions = 0;
        foreach($lines as $line) {
            $occurances = substr_count($line['value'], $line['char']);
            if($occurances >= $line['min'] && $occurances <= $line['max']) {
                $solutions++;
            }
        }

        return "$solutions";
    }

}