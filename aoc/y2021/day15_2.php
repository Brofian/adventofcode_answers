<?php

namespace aoc\y2021;

use src\PHP\AbstractRiddle;

/**
 * @Warning Currently, this file is causing an "allowed memory size exhausted" error
 */


class day15_2 extends AbstractRiddle {

    protected int $gridWidth;
    protected int $gridHeight;
    protected array $targetPosition;
    //the single values of each position
    protected array $grid = [];

    //the list containing the data of every field (the total dist to start, the previous, the x and y coords)
    protected array $totalList = [];
    //the list containing all currently open to check fields
    protected array $openList = [];
    //the list containing already checked fields
    protected array $closedList = [];


    public function getRiddleDescription(): string
    {
        return 'Using the full map, what is the lowest total risk of any path from the top left to the bottom right?';
    }

    public function getRiddleAnswer(): string
    {
        // i havent got time for any other method than this...
        ini_set('memory_limit', '256M');


        $this->grid = $this->readLinesOfFile(__DIR__ . '/files/day15.txt', (function($line) {
            return array_map(function($item) {
                return (int)$item;
            }, str_split(trim($line)));
        }));

        $this->gridWidth = count($this->grid[0]);
        $this->gridHeight = count($this->grid);
        $this->targetPosition = ['x' => ($this->gridWidth*5)-1, 'y' => ($this->gridHeight*5)-1];
        $this->initGrid();

        $result = 0;
        while(!empty($this->openList)) {

            echo str_pad("Open fields: ".count($this->openList), 30) . "\r";

            //find nearest element
            $nearestElementKey = $this->findFieldWithLeastDistance();
            $nearestElement = &$this->totalList[$nearestElementKey];

            if($nearestElement['x'] == $this->targetPosition['x'] && $nearestElement['y'] == $this->targetPosition['y']) {
                //found the target
                echo str_pad('', 30) . "\r";
                $result = $nearestElement['dist'];
                break;
            }


            //add the element to the checked list and remove it from the open list
            $this->closedList[$nearestElementKey] = true;
            unset($this->openList[$nearestElementKey]);


            //update adjacent elements and add them to the open list
            $adjacentFieldKeys = $this->getAdjacentFields($nearestElement['x'], $nearestElement['y']);
            foreach($adjacentFieldKeys as $adjacentFieldKey) {
                $adjacentField = &$this->totalList[$adjacentFieldKey];

                $totalDistOnThisWay = $nearestElement['dist'] + $this->getValueFromField($adjacentField['x'], $adjacentField['y']);
                $totalDistOnAnotherWay = $adjacentField['dist'];

                if($totalDistOnThisWay < $totalDistOnAnotherWay) {
                    //this way is nearer, than any other found way -> update the adjacent field
                    $adjacentField['dist'] = $totalDistOnThisWay;
                    $adjacentField['prev'] = $nearestElementKey;
                }

                $this->openList[$adjacentFieldKey] = true;
            }
        }



        return $result;
    }



    //find the field from the open list, having the least distance to the starting point
    protected function findFieldWithLeastDistance(): string {
        $smallestKey = '0-0';
        $smallestDist = PHP_INT_MAX;

        foreach($this->openList as $key => $true) {
            $dist = $this->totalList[$key]['dist'];

            if($smallestDist > $dist) {
                $smallestDist = $dist;
                $smallestKey = $key;
            }
        }

        return $smallestKey;
    }


    protected function initGrid(): void {
        for($xMult = 0; $xMult < 5; $xMult++) {
            for($yMult = 0; $yMult < 5; $yMult++) {

                for($x = 0; $x < $this->gridWidth; $x++) {
                    for($y = 0; $y < $this->gridHeight; $y++) {
                        $xCoord = $xMult * $this->gridWidth + $x;
                        $yCoord = $yMult * $this->gridHeight + $y;

                        $this->totalList["$xCoord-$yCoord"] = [
                            'dist' => PHP_INT_MAX,
                            'distToTarget' => $this->getDistanceToTarget($xCoord, $yCoord),
                            'prev' => null,
                            'x' => $xCoord,
                            'y' => $yCoord
                        ];
                    }
                }

            }
        }

        //init 0-0 as the starting point
        $this->totalList["0-0"]['dist'] = 0;
        $this->openList["0-0"] = true;
    }



    protected function getAdjacentFields(int $x, int $y): array {
        $adjacentFields = [];

        $possibilities = [
            ['check' => $x < ($this->gridWidth*5)-1,    'key' => ($x+1).'-'.$y],
            ['check' => $y < ($this->gridHeight*5)-1,   'key' => $x.'-'.($y+1)],
            ['check' => $x > 0,                         'key' => ($x-1).'-'.$y],
            ['check' => $y > 0,                         'key' => $x.'-'.($y-1)],
        ];

        foreach($possibilities as $possibility) {
            //return only possibilities with a valid check (= they are inside the grid) and if they are not already in the closed or open list
            if($possibility['check'] && !isset($this->openList[$possibility['key']]) && !isset($this->closedList[$possibility['key']])) {
                $adjacentFields[] = $possibility['key'];
            }
        }

        return $adjacentFields;
    }


    protected function getValueFromField(int $x, int $y): int {

        $addX = floor($x / $this->gridWidth);
        $addY = floor($y / $this->gridHeight);

        $x %= $this->gridWidth;
        $y %= $this->gridHeight;
        $originalValue = $this->grid[$x][$y];


        $newValue = $originalValue + $addX + $addY;
        while($newValue > 9) {
            $newValue -= 9;
        }

        return $newValue;
    }

    protected function getDistanceToTarget(int $x, int $y): float {
        $tx = $this->targetPosition['x'];
        $ty = $this->targetPosition['y'];

        return abs(
            sqrt(pow($tx-$x, 2) + pow($ty-$y, 2))
        );
    }

}