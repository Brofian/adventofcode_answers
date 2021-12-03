<?php

namespace aoc\y2021;

use src\AbstractRiddle;

class day02_1 extends AbstractRiddle {

    function getRiddleDescription(): string
    {
        return 'What do you get if you multiply your final horizontal position by your final depth?';
    }

    function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day02.txt');

        $posX = 0;
        $posY = 0;
        foreach($lines as $line) {
            list($command, $value) = explode(' ', $line);
            switch ($command) {
                case 'forward':
                    $posX += $value;
                    break;
                case 'up':
                    $posY -= $value;
                    break;
                case 'down':
                    $posY += $value;
                    break;
            }
        }

        return $posX*$posY;
    }

}