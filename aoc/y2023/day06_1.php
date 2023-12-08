<?php

namespace aoc\y2023;

use src\AbstractRiddle;

class day06_1 extends AbstractRiddle {

    protected array $rounds = [];


    public function getRiddleDescription(): string
    {
        return 'What is the range of timings, that will cause you to win the race, multiplied together?';
    }


    public function getRiddleAnswer(): string
    {
        $lines = file(__DIR__ . '/files/day06.txt');

        $this->parseLines($lines);


        $prod = 1;
        foreach ($this->rounds as $round) {

            // time-hold * time-not-hold
            // a > 0 && a < round['time'] -> max(a * (round['time'] - a))

            // win, if
            // a * (round['time'] - a) > round['distance']
            // a * round['time'] -  a^2 > round['distance']
            //

            $t = $round['time'];
            $d = $round['distance'];

            $minA = 0;
            for ($a = 1; $a <= $t/2; $a++) {
                if ($a * ($t - $a) > $d) {
                    $minA = $a;
                    break;
                }
            }

            $maxA = $t - $minA;
            $possibleSolutions = $maxA - $minA + 1;
            //echo $prod . " * " . $possibleSolutions;
            $prod *= $possibleSolutions;
            //echo " = " . $prod . PHP_EOL;
        }

        return $prod;
    }


    /**
     * @param string[] $lines
     * @return void
     */
    protected function parseLines(array $lines): void {
        $times = explode(' ', explode(':', $lines[0], 2)[1]);
        $distances = explode(' ', explode(':', $lines[1], 2)[1]);

        $nonEmptyStringCheck = static function (string $s): bool {
            return !empty($s);
        };

        $times = array_values(array_filter($times, $nonEmptyStringCheck));
        $distances = array_values(array_filter($distances, $nonEmptyStringCheck));

        foreach ($times as $roundId => $time) {
            $this->rounds[] = [
                'time' => $time,
                'distance' => $distances[$roundId]
            ];
        }
    }
}