<?php

namespace aoc\y2021;

use src\AbstractRiddle;
use src\Stopwatch;

class day14_2 extends AbstractRiddle {

    protected array $neighbours = [];
    protected array $replacements = [];

    public function getRiddleDescription(): string
    {
        return 'What do you get if you take the quantity of the most common element and subtract the quantity of the least common element?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day14.txt', (function($line) {
            return trim($line);
        }));
        $this->interpretLines($lines);

        for($step = 0; $step < 10; $step++) {
            $this->computeStep();
        }

        $mostCommonNum = $this->findMostCommonElementCountInPolymer();
        //$leastCommonNum = $this->findMostCommonElementCountInPolymer(true);

        return '';
    }

    protected function findMostCommonElementCountInPolymer(bool $returnLeastCommon = false): int {

        $counts = [];
        foreach($this->neighbours as $neighbours => $num) {
            list($first,$second) = str_split($neighbours);

            if(!isset($counts[$first])) {
                $counts[$first] = 0;
            }
            $counts[$first] += $num;


            if(!isset($counts[$second])) {
                $counts[$second] = 0;
            }
            $counts[$second] += $num;
        }


        sort($counts);
        var_dump(reset($counts));

        rsort($counts);
        var_dump(reset($counts));

        return 0;
    }

    protected function computeStep(): void {

        $newNeighbours = [];

        foreach($this->neighbours as $neighbours => $num) {
            var_dump($neighbours .' -> '. $num);

            if(isset($this->replacements[$neighbours])) {
                list($first,$second) = str_split($neighbours);

                $addition = $this->replacements[$neighbours];

                if(!isset($newNeighbours[$first.$addition])) {
                    $newNeighbours[$first.$addition] = 0;
                }
                $newNeighbours[$first.$addition] += $num;


                if(!isset($newNeighbours[$addition.$second])) {
                    $newNeighbours[$addition.$second] = 0;
                }
                $newNeighbours[$addition.$second] += $num;


            }
        }

        $this->neighbours = $newNeighbours;
    }

    protected function interpretLines(array $lines): void {
        $polymerChars = str_split(array_shift($lines));
        for($i = 1; $i < count($polymerChars); $i++) {
            $first = $polymerChars[$i-1];
            $second = $polymerChars[$i];

            if(!isset($newNeighbours[$first.$second])) {
                $this->neighbours[$first.$second] = 0;
            }
            $this->neighbours[$first.$second] += 1;        }


        array_shift($lines);
        foreach($lines as $line) {
            preg_match('/^(\w+) -> (\w+)$/m', $line, $matches);
            $this->replacements[$matches[1]] = $matches[2];
        }
    }



}