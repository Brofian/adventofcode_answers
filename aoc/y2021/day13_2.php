<?php

namespace aoc\y2021;

use src\AbstractRiddle;
use src\Stopwatch;

class day13_2 extends AbstractRiddle {

    protected array $foldingSteps = [];
    protected array $dots = [];

    public function getRiddleDescription(): string
    {
        return 'What code do you use to activate the infrared thermal imaging camera system?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day13.txt', (function($line) {
            return trim($line);
        }));

        $this->interpretLines($lines);

        foreach($this->foldingSteps as $foldingStep) {
            $this->applyFoldInstruction($foldingStep);
        }


        return $this->getVisualOutputData();
    }

    protected function getVisualOutputData(): string {
        $maxX = 0;
        $maxY = 0;
        foreach($this->dots as $dotX => $dotColumn) {
            if($dotX > $maxX) $maxX = $dotX;
            foreach($dotColumn as $dotY => $true) {
                if($dotY > $maxY) $maxY = $dotY;
            }
        }

        $lines = [];
        $i = 0;
        for($y = 0; $y <= $maxY; $y++) {
            for($x = 0; $x <= $maxX; $x++) {
                $lines[$i][] = (isset($this->dots[$x][$y]) ? '#' : ' ');
            }
            $i++;
        }

        foreach($lines as &$line) {
            $line = '        ' . trim(implode('', $line));
        }

        return '   '.ltrim(implode(PHP_EOL, $lines));
    }


    protected function applyFoldInstruction(array $instruction): void {

        foreach($this->dots as $dotX => $dotColumn) {
            foreach($dotColumn as $dotY => $true) {

                if($this->isDotAffectedByInstruction($dotX, $dotY, $instruction)) {
                    list($newX, $newY) = $this->getNewDotPositionByInstruction($dotX, $dotY, $instruction);
                    $this->dots[$newX][$newY] = true;
                    unset($this->dots[$dotX][$dotY]);
                }

            }
        }
    }


    protected function getNewDotPositionByInstruction(int $dotX, int $dotY, array $instruction): array {
        $foldingAt = $instruction['at'];

        if($instruction['axis'] === 'x') {
            //update X position
            $dotX = $foldingAt - ($dotX - $foldingAt);
        }
        else {
            //update Y position
            $dotY = $foldingAt - ($dotY - $foldingAt);
        }

        return [$dotX,$dotY];
    }

    protected function isDotAffectedByInstruction(string $x, string $y, array $instruction): bool {
        return (
            ($instruction['axis'] === 'x' && $x > $instruction['at'])
            ||
            ($instruction['axis'] === 'y' && $y > $instruction['at'])
        );
    }

    protected function interpretLines(array $lines): void {

        $isFirstHalf = true;
        foreach($lines as $line) {
            if($isFirstHalf) {
                if($line == '') {
                    $isFirstHalf = false;
                }
                else {
                    list($x,$y) = explode(',',$line);
                    $this->dots[$x][$y] = true;
                }
            }
            else {
                preg_match('/^fold along (x|y)=(\d+)$/m', $line, $matches);
                $this->foldingSteps[] = [
                    'axis' => $matches[1],
                    'at' => $matches[2]
                ];
            }
        }


    }

}