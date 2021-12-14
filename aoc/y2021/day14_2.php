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

        for($step = 0; $step < 40; $step++) {
            $this->computeStep();
        }

        list($leastCommonNum, $mostCommonNum) = $this->findExtremeValues();

        return $mostCommonNum-$leastCommonNum;
    }

    protected function findExtremeValues(): array {

        $counts = [];
        foreach($this->neighbours as $neighbours => $num) {
            list($first,$second) = str_split($neighbours);

            $this->increaseArrayField($counts, $first, $num);
            $this->increaseArrayField($counts, $second, $num);
        }

        sort($counts);
        $least = ceil($counts[0] / 2);
        $most = ceil($counts[count($counts)-1] / 2);

        return [$least, $most];
    }

    protected function computeStep(): void {

        $newNeighbours = [];

        foreach($this->neighbours as $neighbours => $num) {
            //var_dump($neighbours .' -> '. $num);

            if(isset($this->replacements[$neighbours])) {
                list($first,$second) = str_split($neighbours);

                $addition = $this->replacements[$neighbours];

                $this->increaseArrayField($newNeighbours, $first.$addition, $num);
                $this->increaseArrayField($newNeighbours, $addition.$second, $num);

            }
        }

        $this->neighbours = $newNeighbours;
    }

    protected function interpretLines(array $lines): void {
        $polymerChars = str_split(array_shift($lines));
        for($i = 1; $i < count($polymerChars); $i++) {
            $first = $polymerChars[$i-1];
            $second = $polymerChars[$i];

            $this->increaseArrayField($this->neighbours, $first.$second, 1);
        }


        array_shift($lines);
        foreach($lines as $line) {
            preg_match('/^(\w+) -> (\w+)$/m', $line, $matches);
            $this->replacements[$matches[1]] = $matches[2];
        }
    }


    protected function increaseArrayField(array &$array, string $field, int $num): void {
        if(!isset($array[$field])) {
            $array[$field] = 0;
        }
        $array[$field] += $num;
    }

}