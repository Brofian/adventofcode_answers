<?php

namespace aoc\y2021;

use src\PHP\AbstractRiddle;

class day09_1 extends AbstractRiddle {

    protected array $data = [];

    public function getRiddleDescription(): string
    {
        return 'What is the sum of the risk levels of all low points on your heightmap?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day09.txt', (function($line) {
            return str_split(trim($line));
        }));

        $this->data['rows'] = count($lines);
        $this->data['cols'] = count($lines[0]);

        $sumOfRiskLevels = 0;
        for($y = 0; $y < $this->data['rows']; $y++) {
            for($x = 0; $x < $this->data['cols']; $x++) {
                $isLowestPoint = $this->isLowestPoint($x, $y, $lines);

                if($isLowestPoint) {
                    var_dump("lowest: $x/$y");
                    $sumOfRiskLevels += (1 + $lines[$y][$x]);
                }
            }
        }

        return $sumOfRiskLevels;
    }

    protected function isLowestPoint(int $x, int $y, array $lines): bool {

        $value = $lines[$y][$x];

        return !(
            //left
            ($x > 0                     && $lines[$y][$x-1] <= $value) ||
            //right
            ($x < $this->data['cols']-1 && $lines[$y][$x+1] <= $value) ||
            //up
            ($y > 0                     && $lines[$y-1][$x] <= $value) ||
            //down
            ($y < $this->data['rows']-1 && $lines[$y+1][$x] <= $value)
        );

    }

}