<?php

namespace aoc\y2021;

use src\PHP\AbstractRiddle;

class day09_2 extends AbstractRiddle {

    protected array $lines;

    public function getRiddleDescription(): string
    {
        return 'What do you get if you multiply together the sizes of the three largest basins?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day09.txt', (function($line) {
            return str_split(trim($line));
        }));
        $this->lines = $lines;


        $lowestPoints = $this->findLowestPoints();
        //var_dump(count($lowestPoints));

        $basins = $this->findBasins($lowestPoints);
        //var_dump($basins[0]);


        $products = [];
        foreach($basins as $basin) {
            $products[] = count($basin);
        }
        rsort($products);

        $product = $products[0] * $products[1] * $products[2];

        return $product;
    }

    protected function findLowestPoints(): array {
        $lowestPoints = [];

        for($x = 0; $x < count($this->lines[0]); $x++) {
            for($y = 0; $y < count($this->lines); $y++) {

                $current= $this->getCoordinateHeight($x,$y);
                $up     = $this->getCoordinateHeight($x,$y-1);
                $down   = $this->getCoordinateHeight($x,$y+1);
                $left   = $this->getCoordinateHeight($x-1,$y);
                $right  = $this->getCoordinateHeight($x+1,$y);

                if($this->isPointLowerThanPoints($current, $up, $down, $left, $right)) {
                    $lowestPoints[] = [
                        'x' => $x,
                        'y' => $y
                    ];
                }
            }
        }

        return $lowestPoints;
    }

    protected function findBasins(array $lowestPoints): array {
        $basins = [];


        foreach($lowestPoints as $index => $lowestPoint) {
            $basinPoints = [];
            $pointsToCheck = [
                $lowestPoint['x'].'|'.$lowestPoint['y'] => $lowestPoint
            ];

            while(!empty($pointsToCheck)) {

                foreach($pointsToCheck as $key => $pointToCheck) {

                    $adjacentHigherPoints = $this->getAdjacentHigherFields($pointToCheck['x'],$pointToCheck['y']);
                    foreach($adjacentHigherPoints as $adjacentHigherPoint) {
                        $abbrev = $adjacentHigherPoint['x'].'|'.$adjacentHigherPoint['y'];
                        //only fields below 9 count towards basins

                        if($adjacentHigherPoint['h'] < 9 && !isset($pointsToCheck[$abbrev]) && !isset($basinPoints[$abbrev])) {
                            $pointsToCheck[$abbrev] = $adjacentHigherPoint;
                        }
                    }

                    //store point as checked and part of basin
                    $abbrev = $pointToCheck['x'].'|'.$pointToCheck['y'];
                    if(!isset($basinPoints[$abbrev])) {
                        $basinPoints[$abbrev] = $pointToCheck;
                    }
                    unset($pointsToCheck[$key]);
                }

            }

            $basins[] = $basinPoints;
        }

        return $basins;
    }

    protected function getAdjacentHigherFields(int $x, int $y): array {
        $adjacentFields = [];

        $centerValue = $this->getCoordinateHeight($x,$y);

        $posList = [
            [$x, $y-1],
            [$x, $y+1],
            [$x-1, $y],
            [$x+1, $y],
        ];
        foreach($posList as $pos) {
            $height = $this->getCoordinateHeight(...$pos);

            if($height > $centerValue) {
                $adjacentFields[] = ['x' => $pos[0], 'y' => $pos[1], 'h' => $height];
            }
        }

        return $adjacentFields;
    }

    protected function getCoordinateHeight(int $x, int $y): int {
        if(isset($this->lines[$y][$x])) {
            return (int)$this->lines[$y][$x];
        }

        return 10;
    }


    protected function isPointLowerThanPoints(int $p, int ...$points): bool {
        foreach($points as $point) {
            if($point <= $p) {
                return false;
            }
        }
        return true;
    }

}