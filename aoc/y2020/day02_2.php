<?php

namespace aoc\y2020;

use src\AbstractRiddle;

class day02_2 extends AbstractRiddle {

    function getRiddleDescription(): string
    {
        return 'How many passwords are valid according to the new interpretation of the policies?';
    }

    function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day02.txt', (function($line) {return trim($line);}));

        $lines = array_map(function($line) {
            preg_match('/([0-9]*)-([0-9]*) (\w): (\w*)/m', $line, $matches);

            return [
                'posA' => $matches[1],
                'posB' => $matches[2],
                'char' => $matches[3],
                'value' => $matches[4],
            ];
        }, $lines);


        $solutions = 0;
        foreach($lines as $line) {
            $stringChars = str_split($line['value']);
            $charAMatches = $this->checkCharInString($stringChars, $line['char'], $line['posA']-1);
            $charBMatches = $this->checkCharInString($stringChars, $line['char'], $line['posB']-1);
            if($charAMatches != $charBMatches) {
                $solutions++;
            }
        }

        return "$solutions";
    }

    protected function checkCharInString(array $stringArray, string $char, int $position): bool {
        if(count($stringArray) < $position) {
            return false;
        }

        return $stringArray[$position] == $char;
    }

}