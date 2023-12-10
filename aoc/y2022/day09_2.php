<?php

namespace aoc\y2022;

use src\PHP\AbstractRiddle;

class day09_2 extends AbstractRiddle {

    protected array $visitedPoints = [
        '0-0' => 1
    ];

    public function getRiddleDescription(): string
    {
        return 'How many positions does the tail of the rope visit at least once?';
    }

    public function getRiddleAnswer(): string
    {
        $moves = $this->readLinesOfFile(__DIR__ . '/files/day09.txt', (static function($line) {return trim($line);}));

        $knots = array_fill(0, 10, ['x' => 0, 'y' => 0]);


        foreach($moves as $move) {
            $direction = substr($move, 0, 1);
            $distance  = (int)substr($move, 2);

            for($step = 0; $step < $distance; $step++) {

                $newKnotSet = $knots;
                // move head without restrictions
                $newKnotSet[0] = $this->movePoint($knots[0], $direction);

                for($knotI = 1; $knotI < 10; $knotI++) {

                    $areNowAdjacent =
                        abs(($newKnotSet[$knotI-1]['x'] - $newKnotSet[$knotI]['x'])) <= 1 &&
                        abs(($newKnotSet[$knotI-1]['y'] - $newKnotSet[$knotI]['y'])) <= 1;
                    if($areNowAdjacent) {
                        // nothing to do
                        continue;
                    }

                    $isInDifferentRowsAndColumns =
                        $newKnotSet[$knotI - 1]['x'] !== $newKnotSet[$knotI]['x'] &&
                        $newKnotSet[$knotI - 1]['y'] !== $newKnotSet[$knotI]['y'];

                    $headX = $newKnotSet[$knotI - 1]['x'];
                    $headY = $newKnotSet[$knotI - 1]['y'];
                    $tailX = $newKnotSet[$knotI]['x'];
                    $tailY = $newKnotSet[$knotI]['y'];


                    if(!$isInDifferentRowsAndColumns) {
                        if($headX === $tailX) {
                            $dir = $headY > $tailY ? 'U' : 'D';
                        }
                        else {
                            $dir = $headX > $tailX ? 'R' : 'L';
                        }

                        // move current knot one step
                        $newKnotSet[$knotI] = $this->movePoint($knots[$knotI], $dir);
                        continue;
                    }


                    if($headX > $tailX) {
                        $newKnotSet[$knotI] = $this->movePoint($newKnotSet[$knotI], 'R');
                    }
                    else {
                        $newKnotSet[$knotI] = $this->movePoint($newKnotSet[$knotI], 'L');
                    }

                    if($headY > $tailY) {
                        $newKnotSet[$knotI] = $this->movePoint($newKnotSet[$knotI], 'U');
                    }
                    else {
                        $newKnotSet[$knotI] = $this->movePoint($newKnotSet[$knotI], 'D');
                    }
                 }

                $lastKnot = end($newKnotSet);
                $this->log($lastKnot['x'],$lastKnot['y']);

                $knots = $newKnotSet;
                //$this->printState($knots);
            }

        }

        return "".count($this->visitedPoints);
    }

    protected function printState(array $knots): void {
        for($y = 15; $y >= -6; $y--) {
            for($x = -13; $x < 13; $x++) {
                $char = '.';
                foreach($knots as $i => $knot) {
                    if($knot['x'] === $x && $knot['y'] === $y) {
                        $char = $i ?: 'H';
                        break;
                    }
                }
                echo $char;
            }
            echo PHP_EOL;
        }
        echo PHP_EOL.PHP_EOL;
    }

    protected function log(int $x, int $y): void {
        $key = "$x-$y";
        $this->visitedPoints[$key] = ($this->visitedPoints[$key]??0)+1;
    }

    protected function movePoint(array $point, string $direction): array {

        switch($direction) {
            case 'U':
                $point['y']++;break;
            case 'D':
                $point['y']--;break;
            case 'R':
                $point['x']++;break;
            case 'L':
                $point['x']--;break;
        }

        return $point;
    }

}