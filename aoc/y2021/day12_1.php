<?php

namespace aoc\y2021;

use src\AbstractRiddle;
use src\Stopwatch;

class day12_1 extends AbstractRiddle {

    protected array $caveConnections = [];


    public function getRiddleDescription(): string
    {
        return 'How many paths through this cave system are there that visit small caves at most once?';
    }

    public function getRiddleAnswer(): string
    {
        $connections = $this->readLinesOfFile(__DIR__ . '/files/day12.txt', (function($line) {
            return explode('-', trim($line), 2);
        }));

        $this->initConnectionsToUsableArray($connections);


        $numbersOfPossibleWays = $this->navigateToNextCaves('start', []);



        return $numbersOfPossibleWays;
    }


    protected function navigateToNextCaves(string $currentPosition, array $visitedPositions): int {
        $visitedPositions[] = $currentPosition;
        $numberOfPossibleWays = 0;

        if($currentPosition == 'end') {
            return 1;
        }

        foreach($this->caveConnections[$currentPosition] as $newPosition => $isBigCave) {

            if($isBigCave || !in_array($newPosition, $visitedPositions)) {
                $numberOfPossibleWays += $this->navigateToNextCaves($newPosition, $visitedPositions);
            }

        }

        return $numberOfPossibleWays;
    }


    protected function initConnectionsToUsableArray(array $connections): void {
        //gather caves connections
        foreach($connections as $connection) {
            list($caveA, $caveB) = $connection;

            //store connection from A to B
            if(!isset($this->caveConnections[$caveA])) {
                $this->caveConnections[$caveA] = [];
            }
            $this->caveConnections[$caveA][$caveB] = ctype_upper($caveB);

            //store connection from B to A
            if(!isset($this->caveConnections[$caveB])) {
                $this->caveConnections[$caveB] = [];
            }
            $this->caveConnections[$caveB][$caveA] = ctype_upper($caveA);
        }
    }


}