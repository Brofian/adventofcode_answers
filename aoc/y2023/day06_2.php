<?php

namespace aoc\y2023;

use src\AbstractRiddle;

class day06_2 extends AbstractRiddle {

    protected int $time;
    protected int $distance;


    public function getRiddleDescription(): string
    {
        return 'What is the range of possibilities if all numbers in each line are combined?';
    }


    public function getRiddleAnswer(): string
    {
        $lines = file(__DIR__ . '/files/day06.txt');

        $this->parseLines($lines);


        // 0 < a < time
        // win, if:
        //  a * (t-a) > d
        //
        // |                       |t
        //      a           t-a
        //

        // wähle a, sodass
        // at - aa > d
        $minA = $this->binarySearch(0, $this->time);


        echo ($minA * $this->time - $minA*$minA) .'>'. $this->distance . PHP_EOL;
        $maxA = $this->time - $minA + 1;
        echo ($maxA * $this->time - $maxA*$maxA) .'<'. $this->distance . PHP_EOL;

        return ($maxA - $minA);
    }

    protected function checkWinningCondition(int $a): bool {
        return ($a * $this->time - $a*$a) > $this->distance;
    }

    protected function binarySearch(int $lowerLimit, int $upperLimit): int {
        $upperCheck = $this->checkWinningCondition($upperLimit);
        $lowerCheck = $this->checkWinningCondition($lowerLimit);

        $diff = $upperLimit - $lowerLimit;
        // echo "Check between " . $lowerLimit . '('.($lowerCheck ? 1 : 0).') and ' . $upperLimit . '('.($upperCheck ? 1 : 0).')' . PHP_EOL;
        if ($diff === 1 || $diff === 0) {

            if ($upperCheck === true && $lowerCheck === false) {
                return $upperLimit;
            }

            return -1;
        }



        // we search for: $upperCheck->true && $lowerCheck->false

        /*
         *
         *      |          |
         *     222
         * 11b
         *                else
         *                    11b
         *          11a
         */

        if ($upperCheck === $lowerCheck) {

            if ($upperCheck) {
                return -1; // middle, we are wrong here
            }

            // half the search radius
            $middle = $lowerLimit + ($diff/2);
            $lowerHalf = $this->binarySearch($lowerLimit, $middle);
            return ($lowerHalf !== -1) ? $lowerHalf : $this->binarySearch($middle, $upperLimit);
        }

        if ($upperCheck === true && $lowerCheck === false) {
            // go nearer
            $middle = $lowerLimit + ($diff/2);
            $lowerHalf = $this->binarySearch($lowerLimit, $middle);
            return ($lowerHalf !== -1) ? $lowerHalf : $this->binarySearch($middle, $upperLimit);
        }

        return -1;
    }


    /**
     * @param string[] $lines
     * @return void
     */
    protected function parseLines(array $lines): void {
        $times = explode(' ', explode(':', $lines[0], 2)[1]);
        $distances = explode(' ', explode(':', $lines[1], 2)[1]);

        $this->time = (int)implode('', $times);
        $this->distance = (int)implode('', $distances);
    }
}