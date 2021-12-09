<?php

namespace aoc\y2021;

use src\AbstractRiddle;
use src\Stopwatch;

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
        var_dump(count($lowestPoints));

        $basins = $this->findBasins($lowestPoints);


        return '';
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

        //todo
        foreach($lowestPoints as $lowestPoint) {

        }

        return $basins;
    }

    protected function getAdjacentHigherFields(int $x, int $y): array {
        $adjacentFields = [];

        $centerValue = $this->getCoordinateHeight($x,$y);

        if($this->getCoordinateHeight($x,$y-1) > $centerValue) {
            $adjacentFields[] = ['x' => $x, 'y' => $y-1];
        }
        if($this->getCoordinateHeight($x,$y+1) > $centerValue) {
            $adjacentFields[] = ['x' => $x, 'y' => $y+1];
        }
        if($this->getCoordinateHeight($x-1,$y) > $centerValue) {
            $adjacentFields[] = ['x' => $x-1, 'y' => $y];
        }
        if($this->getCoordinateHeight($x+1,$y) > $centerValue) {
            $adjacentFields[] = ['x' => $x+1, 'y' => $y];
        }

        return $adjacentFields;
    }

    protected function getCoordinateHeight(int $x, int $y): int {
        if(isset($this->lines[$y][$x])) {
            return (int)$this->lines[$y][$x];
        }

        return 9;
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