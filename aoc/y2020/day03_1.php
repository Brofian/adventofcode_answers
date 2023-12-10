<?php

namespace aoc\y2020;

use src\PHP\AbstractRiddle;

class day03_1 extends AbstractRiddle {

    public function getRiddleDescription(): string
    {
        return 'Starting at the top-left corner of your map and following a slope of right 3 and down 1, how many trees would you encounter?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day03.txt', (function($line) {return trim($line);}));
        $numLines = count($lines);

        $posX = 0;
        $posY = 0;
        $hits = 0;
        while($posY < $numLines) {
            $plane = str_split($lines[$posY]);
            $obstaclePosition = $posX % count($plane);
            $obstacle = $plane[$obstaclePosition];

            if($obstacle == '#') {
                $hits++;
            }

            $posX += 3;
            $posY += 1;
        }


        return "$hits";
    }

}