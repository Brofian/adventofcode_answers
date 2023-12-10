<?php

namespace aoc\y2021;

use src\PHP\AbstractRiddle;

class day12_2 extends AbstractRiddle {

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


        $numbersOfPossibleWays = $this->navigateToNextCaves('start', [], false);


        //echo str_repeat(' ', 70)."\r";
        return $numbersOfPossibleWays;
    }


    protected function navigateToNextCaves(string $currentPosition, array $visitedPositions, bool $visitedSmallCaveTwice): int {
        $visitedPositions[] = $currentPosition;
        $numberOfPossibleWays = 0;

        if($currentPosition == 'end') {
            //echo str_pad(implode('-', $visitedPositions), 70, ' ') . "\r";
            return 1;
        }

        foreach($this->caveConnections[$currentPosition] as $newPosition => $isBigCave) {

            //do ne reenter the start cave
            if($newPosition == 'start') {
                continue;
            }

            if($isBigCave) {
                $numberOfPossibleWays += $this->navigateToNextCaves($newPosition, $visitedPositions, $visitedSmallCaveTwice);
            }
            else {
                if(!in_array($newPosition, $visitedPositions)) {
                    //first time passing through the cave
                    $numberOfPossibleWays += $this->navigateToNextCaves($newPosition, $visitedPositions, $visitedSmallCaveTwice);
                }
                elseif(!$visitedSmallCaveTwice) {
                    //second time passing through a cave
                    $numberOfPossibleWays += $this->navigateToNextCaves($newPosition, $visitedPositions, true);
                }

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