<?php

namespace aoc\y2023;

use src\AbstractRiddle;

class day03_2 extends AbstractRiddle {

    protected int $numLines = 0;
    protected array $symbolPositions = [];
    protected array $numberPositions = [];

    public function getRiddleDescription(): string
    {
        return 'Calculate the sum of every gears two adjacent numbers multiplied';
    }

    public function getRiddleAnswer(): string
    {
        $lines = file(__DIR__ . '/files/day03.txt');
        $this->numLines = count($lines);

        $this->parseLines($lines);


        $sum = 0;

        foreach ($this->symbolPositions as $lineId => $lineSymbolPositions) {
            foreach ($lineSymbolPositions as $symbolPosition) {
                if ($symbolPosition['symbol'] !== '*') {
                    continue;
                }

                $numbers = $this->getAdjacentNumbers($lineId, $symbolPosition['pos']);

                if (count($numbers) === 2) {
                    $sum += $numbers[0] * $numbers[1];
                }
            }
        }


        return $sum;
    }

    protected function getAdjacentNumbers(int $y, int $x): array {
        $numbers = [];

        // first: check same line
        $adjacentNumbers = array_filter($this->numberPositions[$y], static function($numberPosition) use ($x) {
            return $x === ($numberPosition['start'] - 1) || $x === ($numberPosition['end'] + 1);
        });
        $numbers = array_merge($numbers, $adjacentNumbers);

        if($y !== 0) {
            // first: check previous line
            $adjacentNumbers = array_filter($this->numberPositions[$y-1], static function($numberPosition) use ($x) {
                return $x >= ($numberPosition['start'] - 1) && $x <= ($numberPosition['end'] + 1);
            });
            $numbers = array_merge($numbers, $adjacentNumbers);
        }

        if($y !== $this->numLines-1) {
            // first: check next line
            $adjacentNumbers = array_filter($this->numberPositions[$y+1], static function($numberPosition) use ($x) {
                return $x >= ($numberPosition['start'] - 1) && $x <= ($numberPosition['end'] + 1);
            });
            $numbers = array_merge($numbers, $adjacentNumbers);
        }

        foreach ($numbers as $i => $number) {
            $numbers[$i] = $number['number'];
        }

        return $numbers;
    }

    protected function parseLines(array $lines): void {
        foreach ($lines as $lineIndex => $line) {
            $this->numberPositions[] = [];
            $this->symbolPositions[] = [];

            $gatheringNumber = '';

            foreach (str_split(trim($line)) as $charIndex => $char) {
                if ($char === '.') {
                    if ($gatheringNumber === '') {
                        continue;
                    }
                    $this->numberPositions[$lineIndex][] = [
                        'number' => (int)$gatheringNumber,
                        'start' => $charIndex-(strlen($gatheringNumber)),
                        'end' => $charIndex-1
                    ];
                    $gatheringNumber = '';
                }
                else if (is_numeric($char)) {
                    $gatheringNumber .= $char;
                }
                else {
                    // symbol
                    $this->symbolPositions[$lineIndex][] = [
                        'symbol' => $char,
                        'pos' => $charIndex
                    ];
                    if ($gatheringNumber === '') {
                        continue;
                    }
                    $this->numberPositions[$lineIndex][] = [
                        'number' => (int)$gatheringNumber,
                        'start' => $charIndex-(strlen($gatheringNumber)),
                        'end' => $charIndex-1
                    ];
                    $gatheringNumber = '';
                }
            }
            if ($gatheringNumber !== '') {
                $this->numberPositions[$lineIndex][] = [
                    'number' => (int)$gatheringNumber,
                    'start' => strlen($line)-(strlen($gatheringNumber))-1,
                    'end' => strlen($line)-2
                ];
            }
        }
    }
}