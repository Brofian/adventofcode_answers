<?php

namespace aoc\y2022;

use src\PHP\AbstractRiddle;

class day05_2 extends AbstractRiddle {

    public function getRiddleDescription(): string
    {
        return 'After the rearrangement procedure completes, what crate ends up on top of each stack?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day05.txt', (static function($line) {return trim($line, "\n\r");}));

        $containerStacks = $this->getInitialContainerStacks($lines, $numImageLines);
        $lines = array_slice($lines, $numImageLines+1);

        foreach($lines as $command) {
            preg_match('/move (\d+) from (\d+) to (\d+)/m', $command, $matches);
            [$match, $number, $fromIndex, $toIndex] = $matches;

            // for the specified number of containers: move the first container to the other stack
            $containers = [];
            for($i = 0; $i < $number; $i++) {
                // for the specified number of containers: move the first container to the other stack
                $containers[] = array_shift($containerStacks[$fromIndex-1]);

            }
            array_unshift($containerStacks[$toIndex-1], ...$containers);
        }

        // concat uppermost containers
        $containerString = "";
        foreach($containerStacks as $containerStack) {
            $containerString .= reset($containerStack);
        }


        return "$containerString";
    }

    protected function getInitialContainerStacks(array $lines, &$numImageLines): array {
        // interpret container positions
        $containerStacks = [];
        $containerLines = [];
        $lineCount = count($lines);
        for($i = 0; $i < $lineCount; $i++) {
            $currentLine = $lines[$i];

            if($currentLine === '') {
                // remove interpreted lines from line array
                $numImageLines = $i;
                break;
            }

            $containerLines[] = str_split($currentLine);
        }

        $indexLine = end($containerLines);
        $containerLines = array_splice($containerLines, 0, count($containerLines)-1);
        for($i = 0, $iMax = count($indexLine); $i < $iMax; $i++) {
            if(trim($indexLine[$i]) !== '') {
                // we have a column
                $containerStacks[] = array_filter(array_column($containerLines, $i), static function ($el) { return trim($el); } );
            }
        }
        return $containerStacks;
    }

}