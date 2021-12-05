<?php

namespace aoc\y2021;

use src\AbstractRiddle;
use src\IO;
use src\ThreadFunction;

class day05_2 extends AbstractRiddle {

    protected int $calculatedLines = 0;
    protected int $totalLines = 0;

    public function getRiddleDescription(): string
    {
        return 'Consider all of the lines. At how many points do at least two lines overlap?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day05.txt', (function($line) {
            $line = trim($line);
            preg_match_all('/\d+/m', $line, $matches);
            $matches = array_shift($matches);

            return [
                'x1' => $matches[0],
                'y1' => $matches[1],
                'x2' => $matches[2],
                'y2' => $matches[3],
            ];
        }));


        $affectedPoints = [];
        $this->totalLines = count($lines);

        foreach($lines as $line) {
            $affectedPoints = $this->getAffectedPointsFromLine($line, $affectedPoints);
        }


        $dangerousPoints = $this->getDangerousPointCount($affectedPoints);

        return $dangerousPoints . str_repeat(' ', 28);
    }



    protected function getDangerousPointCount(array $points): int {
        $dangerousPoints = 0;

        foreach($points as $row) {
            foreach($row as $point) {
                if($point > 1) {
                    $dangerousPoints++;
                }
            }
        }

        return $dangerousPoints;
    }

    public function getAffectedPointsFromLine(array $line, array $points): array {
        /*

        . 1 . . . . . . . .
        . . 1 . . . . . . .
        . . . 1 . . . . . .
        . . . . . . 1 . . .
        . . . . . 1 . . . .
        . . . . 1 . . . . .

        */

        $xStart = $line['x1'];
        $yStart = $line['y1'];
        $xEnd   = $line['x2'];
        $yEnd   = $line['y2'];

        $dirX = ($xStart == $xEnd) ? 0 : (($xStart < $xEnd) ? 1 : -1);
        $dirY = ($yStart == $yEnd) ? 0 : (($yStart < $yEnd) ? 1 : -1);


        $x = $xStart;
        $y = $yStart;
        do {
            $finished = ($x == $xEnd && $y == $yEnd);

            $points[$x][$y] = 1 + ($points[$x][$y] ?? 0);

            $x += $dirX;
            $y += $dirY;
        }
        while(!$finished);

        $this->calculatedLines++;

        return $points;
    }



}