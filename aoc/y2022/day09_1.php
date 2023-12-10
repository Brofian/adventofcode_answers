<?php

namespace aoc\y2022;

use src\PHP\AbstractRiddle;

class day09_1 extends AbstractRiddle {

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

        $t = ['x' => 0, 'y' => 0];
        $h = ['x' => 0, 'y' => 0];
        foreach($moves as $move) {
            $direction = substr($move, 0, 1);
            $distance  = (int)substr($move, 2);

            for($i = 0; $i < $distance; $i++) {

                $stoodDiagonal = abs(($h['x']-$t['x']))===1 &&
                                 abs(($h['y']-$t['y']))===1;

                // step 1: move head
                $lastH = $h;
                $h = $this->movePoint($h, $direction);

                // get distance from tail to head
                $areAdjacent =  abs(($h['x']-$t['x'])) <= 1 &&
                                abs(($h['y']-$t['y'])) <= 1;
                if($areAdjacent) {
                    // nothing to do
                    continue;
                }

                if($stoodDiagonal) {
                    $t = $lastH;
                    $key = $t['x'].'-'.$t['y'];
                    $this->visitedPoints[$key] = ($this->visitedPoints[$key]??0)+1;
                    continue;
                }

                // move the tail accordingly
                $t = $this->movePoint($t, $direction);
                $key = $t['x'].'-'.$t['y'];
                $this->visitedPoints[$key] = ($this->visitedPoints[$key]??0)+1;
            }
        }

        return "".count($this->visitedPoints);
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