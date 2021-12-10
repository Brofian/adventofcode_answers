<?php

namespace aoc\y2021;

use src\AbstractRiddle;
use src\Stopwatch;

class day10_1 extends AbstractRiddle {

    public const CHUNK_BORDER_VALUE = [
        ')' => 3,
        ']' => 57,
        '}' => 1197,
        '>' => 25137,
    ];


    public const CHUNK_BORDERS = [
        ')' => '(',
        ']' => '[',
        '}' => '{',
        '>' => '<',
    ];

    public function getRiddleDescription(): string
    {
        return 'What is the total syntax error score for those errors?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day10.txt', (function($line) {
            return str_split(trim($line));
        }));

        $points = 0;
        foreach($lines as $line) {
            $firstCorruptedChunkBorder = $this->getFirstCorruptedChunkBorderFromLine($line);
            if($firstCorruptedChunkBorder != '') {
                $points += self::CHUNK_BORDER_VALUE[$firstCorruptedChunkBorder];
            }
        }


        return $points;
    }


    protected function getFirstCorruptedChunkBorderFromLine(array $line): string {
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



        return '';
    }

}