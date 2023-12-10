<?php

namespace aoc\y2023;

use src\PHP\AbstractRiddle;

class day03_1 extends AbstractRiddle {

    protected int $numLines = 0;
    protected array $symbolPositions = [];
    protected array $numberPositions = [];

    public function getRiddleDescription(): string
    {
        return 'Find the missing part by adding up all the part numbers of the schematic';
    }

    public function getRiddleAnswer(): string
    {
        $lines = file(__DIR__ . '/files/day03.txt');
        $this->numLines = count($lines);

        $this->parseLines($lines);

        //var_dump($this->numberPositions[1]);

        $sum = 0;

        foreach ($this->numberPositions as $lineId => $lineNumberPositions) {
            foreach ($lineNumberPositions as $numberPositions) {
                if ($this->hasAdjacentSymbol($lineId, $numberPositions['start'], $numberPositions['end'])) {
                    $sum += $numberPositions['number'];
                }

                else {
                    //echo $numberPositions['number'] . " has no adjacent symbol!".PHP_EOL;
                }

            }
        }


        return $sum;
    }

    protected function hasAdjacentSymbol(int $y, int $start, int $end): bool {
        // first: check same line
        $touchingSymbols = array_filter($this->symbolPositions[$y], static function($symbolPosition) use ($start, $end) {
            return $symbolPosition === ($start - 1) || $symbolPosition === ($end + 1);
        });
        if (!empty($touchingSymbols)) {
            return true;
        }

        if($y !== 0) {
            // first: check previous line
            $touchingSymbols = array_filter($this->symbolPositions[$y-1], static function($symbolPosition) use ($start, $end) {
                return $symbolPosition >= ($start - 1) && $symbolPosition <= ($end + 1);
            });
            if (!empty($touchingSymbols)) {
                return true;
            }
        }

        if($y !== $this->numLines-1) {
            // first: check next line
            $touchingSymbols = array_filter($this->symbolPositions[$y+1], static function($symbolPosition) use ($start, $end) {
                return $symbolPosition >= ($start - 1) && $symbolPosition <= ($end + 1);
            });
            if (!empty($touchingSymbols)) {
                return true;
            }
        }

        return false;
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
                    $this->symbolPositions[$lineIndex][] = $charIndex;
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