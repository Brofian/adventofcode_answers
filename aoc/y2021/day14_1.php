<?php

namespace aoc\y2021;

use src\AbstractRiddle;
use src\Stopwatch;

class day14_1 extends AbstractRiddle {

    protected array $polymerString = [];
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
        $leastCommonNum = $this->findMostCommonElementCountInPolymer(true);

        return $mostCommonNum - $leastCommonNum;
    }

    protected function findMostCommonElementCountInPolymer(bool $returnLeastCommon = false): int {
        $c = [];
        foreach($this->polymerString as $char) {
            if(!isset($c[$char])) {
                $c[$char] = 0;
            }

            $c[$char]++;
        }

        if($returnLeastCommon) {
            sort($c);
        }
        else {
            rsort($c);
        }

        return $c[0];
    }

    protected function computeStep(): void {
        $newPolymer = [];

        $newPolymer[] = $this->polymerString[0];
        for($i = 1; $i < count($this->polymerString); $i++) {
            $replacementCode = $this->polymerString[$i-1].$this->polymerString[$i];

            if(isset($this->replacements[$replacementCode])) {
                $newPolymer[] = $this->replacements[$replacementCode];
            }

            $newPolymer[] = $this->polymerString[$i];
        }

        $this->polymerString = $newPolymer;
    }

    protected function interpretLines(array $lines): void {
        $this->polymerString = str_split(array_shift($lines));
        array_shift($lines);

        foreach($lines as $line) {
            preg_match('/^(\w+) -> (\w+)$/m', $line, $matches);
            $this->replacements[$matches[1]] = $matches[2];
        }
    }

}