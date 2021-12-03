<?php

namespace aoc\y2021;

use src\AbstractRiddle;

class day03_2 extends AbstractRiddle {

    public const NUM_BITS = 12;

    public function getRiddleDescription(): string
    {
        return 'What is the life support rating of the submarine?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day03.txt');

        $binaryNumbers = array_map(function ($item) {
            $bits = str_split($item);
            return $bits;
        }, $lines);




        $remainingNumbers = $binaryNumbers;
        for($i = 0; $i < self::NUM_BITS; $i++) {
            //get most common bit for this position
            $mostCommonBit = $this->getMostCommonBit(array_column($remainingNumbers, $i));

            //remove all numbers that does not match this bit
            foreach($remainingNumbers as $key => $remainingNumber) {
                if($remainingNumber[$i] != $mostCommonBit) {
                    unset($remainingNumbers[$key]);
                }
            }

            if(count($remainingNumbers) == 1) {
                break;
            }
        }


        $oxygenRating = reset($remainingNumbers);
        $oxygenRating = implode('', $oxygenRating);
        $oxygenRating = bindec($oxygenRating);


        $remainingNumbers = $binaryNumbers;
        for($i = 0; $i < self::NUM_BITS; $i++) {
            //get most common bit for this position
            $leastCommonBit = $this->getMostCommonBit(array_column($remainingNumbers, $i)) ? 0 : 1;

            //remove all numbers that does not match this bit
            foreach($remainingNumbers as $key => $remainingNumber) {
                if($remainingNumber[$i] != $leastCommonBit) {
                    unset($remainingNumbers[$key]);
                }
            }

            if(count($remainingNumbers) == 1) {
                break;
            }
        }

        $co2ScrubberRating = reset($remainingNumbers);
        $co2ScrubberRating = implode('', $co2ScrubberRating);
        $co2ScrubberRating = bindec($co2ScrubberRating);




        return "oxygen: " . $oxygenRating .
               ', CO2: ' . $co2ScrubberRating .
               ', total: ' . ($oxygenRating * $co2ScrubberRating);
    }

    protected function getMostCommonBit(array $bits): int {
        $cond = 0;

        foreach($bits as $bit) {
            $cond += $bit ? 1 : -1;
        }

        return (int)($cond >= 0);
    }





}