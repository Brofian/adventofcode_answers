<?php

namespace aoc\y2021;

use src\AbstractRiddle;
use src\Stopwatch;

class day11_2 extends AbstractRiddle {

    protected array $rows;
    protected int $rowCount;
    protected int $colCount;
    protected array $flashingOctopus = [];

    public function getRiddleDescription(): string
    {
        return 'If you can calculate the exact moments when the octopuses will all flash simultaneously, you should be able to navigate through the cavern. What is the first step during which all octopuses flash?';
    }

    public function getRiddleAnswer(): string
    {
        $this->rows = $this->readLinesOfFile(__DIR__ . '/files/day11.txt', (function($line) {
            return str_split(trim($line));
        }));


        $this->rowCount = count($this->rows);
        $this->colCount = count($this->rows[0]);

        //simulate 100 steps
        $firstStepWithAllOctopusBright = -1;
        $step = 0;
        while(true) {
            $step++;
            if($this->simulateStep() == ($this->rowCount*$this->colCount)) {
                $firstStepWithAllOctopusBright = $step;
                break;
            }
        }


        return $firstStepWithAllOctopusBright;
    }

    protected function simulateStep(): int {
        $this->flashingOctopus = [];

        for($y = 0; $y < $this->rowCount; $y++) {
            for($x = 0; $x < $this->colCount; $x++) {
                $this->activateAt($x, $y);
            }
        }

        //reset all flashing octopus
        foreach($this->flashingOctopus as $flashingOctopus) {
            $this->rows[$flashingOctopus['y']][$flashingOctopus['x']] = 0;
        }

        return count($this->flashingOctopus);
    }


    protected function activateAt(int $x, int $y): int {
        if($x < 0 || $y < 0 || $x > $this->colCount-1 || $y > $this->rowCount-1) {
            return 0;
        }

        $this->rows[$y][$x]++;
        if($this->rows[$y][$x] == 10) {
            $this->flashingOctopus["$x-$y"] = ['x' => $x, 'y' => $y];

            $nextPositions = [
                [$x-1,$y],
                [$x-1,$y+1],
                [$x-1,$y-1],
                [$x+1,$y+1],
                [$x+1,$y-1],
                [$x+1,$y],
                [$x  ,$y+1],
                [$x  ,$y-1],
            ];

            $flashes = 0;
            foreach($nextPositions as $position) {
                if(!isset($this->flashingOctopus[$position[0]."-".$position[1]])) {
                    $flashes += $this->activateAt($position[0], $position[1]);
                }
            }

            return $flashes;
        }
        return 0;
    }

}