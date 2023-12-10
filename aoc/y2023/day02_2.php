<?php

namespace aoc\y2023;

use src\PHP\AbstractRiddle;

class day02_2 extends AbstractRiddle {


    public function getRiddleDescription(): string
    {
        return 'Check what the minimum number of cubes required for each game would be and sum up the power of these numbers';
    }

    public function getRiddleAnswer(): string
    {
        $lines = file(__DIR__ . '/files/day02.txt');

        $games = $this->interpretLines($lines);

        $sum = 0;
        foreach ($games as $game) {
            $minAmount = $this->getMinimumAmountOfCubes($game);
            $power = array_reduce($minAmount, static function($carry, $amount) {
                return $carry * $amount;
            }, 1);
            $sum += $power;
        }

        return $sum;
    }

    private function getMinimumAmountOfCubes(array $draws): array {
        $minimumAmount = [
            'red' => 0,
            'green' => 0,
            'blue' => 0,
        ];
        foreach ($draws as $dices) {
            foreach ($dices as $dice) {
                $color = $dice['color'];
                if ($minimumAmount[$color] < $dice['num']) {
                    $minimumAmount[$color] = $dice['num'];
                }
            }
        }
        return $minimumAmount;
    }

    private function interpretLines(array $lines): array {
        $games = [];
        foreach ($lines as $line) {
            [$gameTitle, $sets] = explode(':', $line, 2);
            $games[$gameTitle] = [];
            $draws = explode(';', $sets);

            foreach ($draws as $draw){
                $drawResults = [];
                $dices = explode(',', $draw);

                foreach ($dices as $dice) {
                    preg_match('/(\d+) ([a-z]+)/', $dice, $matches);
                    $drawResults[] = [
                        'num' => $matches[1],
                        'color' => $matches[2],
                    ];
                }

                $games[$gameTitle][] = $drawResults;
            }
        }
        return array_values($games);
    }

}