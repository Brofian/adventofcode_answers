<?php

namespace aoc\y2015;

use src\PHP\AbstractRiddle;

class day06_1 extends AbstractRiddle {

    /** @var int[] $lights  */
    protected array $lights = [];

    /** @var int[] $bitMap */
    protected array $bitMap = [];

    public function getRiddleDescription(): string
    {
        return 'After following the instructions, how many lights are lit? (Coding Challenge: Make it work for php5.6)';
    }

    public function getRiddleAnswer(): string
    {
        // prepare lights array
        $intSize = $this->getIntSize();
        for($intPos = 0; $intPos < (1000*1000/$intSize); $intPos++) {
            $this->lights[$intPos] = $this->lights[$intPos] ?? 0;
        }

        $lines = file(__DIR__ . '/files/day06.txt');

        //gather commands
        [$zero, $operation, $fromX, $fromY, $toX, $toY] = [null, '',0,0,0,0];
        foreach($lines as $line) {
            preg_match('/(.*) ([0-9]*),([0-9]*) through ([0-9]*),([0-9]*)/m', $line, $matches);
            [$zero, $operation, $fromX, $fromY, $toX, $toY] = [...$matches];


            for($y = $fromY; $y <= $toY; $y++) {
                for($x = $fromX; $x <= $toX; $x++) {
                    $bitIndex = $x+($y*1000);
                    $intPos = floor($bitIndex/$intSize);
                    $bitPos = $bitIndex % $intSize;

                    $int = &$this->lights[$intPos];
                    $bit = &$this->bitMap[$bitPos];

                    switch($operation) {
                        case 'turn on':
                            $int |= $bit;
                            break;
                        case 'turn off':
                            $int &= ~$bit;
                            break;
                        case 'toggle':
                            $int ^= $bit;
                            break;
                    }
                }
            }
        }


        //count lit lights
        $count = 0;
        foreach($this->lights as $light) {
            $count += $this->countSetBits($light, $intSize);
        }

        return $count;
    }

    protected function countSetBits($int, $intSize): int {
        $bits = 0;
        for($i = 0; $i < $intSize; $i++) {
            $bits = ($int&1) ? $bits+1 : $bits;
            $int >>= 1;
        }
        return $bits;
    }

    protected function getIntSize(): int {
        $num = 1;
        $bits = 0;
        while($num !== 0) {
            $this->bitMap[] = $num;
            $num <<= 1;
            $bits++;
        }

        return $bits;
    }

}