<?php

namespace aoc\y2020;

use src\AbstractRiddle;

class day03_2 extends AbstractRiddle {

    public function getRiddleDescription(): string
    {
        return 'What do you get if you multiply together the number of trees encountered on each of the listed slopes?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day03.txt', (
            function($line) {
                return str_split(trim($line));
            }
        ));

        $hits1 = $this->calculateHitsForSlope($lines, 1, 1);
        $hits2 = $this->calculateHitsForSlope($lines, 3, 1);
        $hits3 = $this->calculateHitsForSlope($lines, 5, 1);
        $hits4 = $this->calculateHitsForSlope($lines, 7, 1);
        $hits5 = $this->calculateHitsForSlope($lines, 1, 2);



        return $hits1*$hits2*$hits3*$hits4*$hits5;
    }


    protected function calculateHitsForSlope(array $plains, int $slopeX, int $slopeY): int {
        $posX = 0;
        $posY = 0;
        $hits = 0;

        while($posY < count($plains)) {
            $plane = $plains[$posY];
            $obstaclePosition = $posX % count($plane);
            $obstacle = $plane[$obstaclePosition];

            if($obstacle == '#') {
                $hits++;
            }

            $posX += $slopeX;
            $posY += $slopeY;
        }

        return $hits;
    }

}