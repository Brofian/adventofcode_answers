<?php

namespace aoc\y2021;

use src\AbstractRiddle;
use src\Stopwatch;

class day10_2 extends AbstractRiddle {

    public const CHUNK_BORDER_VALUE = [
        ')' => 1,
        ']' => 2,
        '}' => 3,
        '>' => 4,
    ];


    public const CHUNK_BORDERS = [
        ')' => '(',
        ']' => '[',
        '}' => '{',
        '>' => '<',
    ];

    public function getRiddleDescription(): string
    {
        return '';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day10.txt', (function($line) {
            return str_split(trim($line));
        }));

        $points = [];
        foreach($lines as $line) {
            $firstCorruptedChunkBorder = $this->getFirstCorruptedChunkBorderFromLine($line, $stack);

            //now ignore corrupted lines
            if($firstCorruptedChunkBorder === '') {
                $autoCompleteChars = $this->getAutoCompleteFromStack($stack);

                $currentScore = 0;
                foreach($autoCompleteChars as $autoCompleteChar) {
                    $currentScore *= 5;
                    $currentScore += self::CHUNK_BORDER_VALUE[$autoCompleteChar];
                }

                $points[] = $currentScore;
            }
        }

        sort($points);

        $middle = floor(count($points) / 2);
        return $points[$middle];
    }


    protected function getFirstCorruptedChunkBorderFromLine(array $line, &$stack = null): string {
        $stack = [];

        $openingBrackets = array_values(self::CHUNK_BORDERS);

        foreach($line as $chunkBorder) {
            //if its an opening chunk border, put it on top of the stack
            if(in_array($chunkBorder, $openingBrackets)) {
                array_unshift($stack, $chunkBorder);
                continue;
            }

            //if its the closing border to the last element on the stack, remove the item from the stack
            if(self::CHUNK_BORDERS[$chunkBorder] === reset($stack)) {
                array_shift($stack);
                continue;
            }

            //if its neither an opening chunk border, nor the appropriate closing one, its an error!
            return $chunkBorder;
        }

        //if no corruption was found, return an empty string
        return '';
    }

    protected function getAutoCompleteFromStack(array $stack): array {
        $reversedChunkBorders = array_flip(self::CHUNK_BORDERS);

        $stack = array_map(function ($item) use ($reversedChunkBorders) {
            return $reversedChunkBorders[$item];
        }, $stack);

        return $stack;
    }

}