<?php

namespace aoc\y2023;

use src\PHP\AbstractRiddle;

class day02_1 extends AbstractRiddle {


    public function getRiddleDescription(): string
    {
        return 'Check how many of the game results would be possible with the given dice and sum up the round numbers';
    }

    public function getRiddleAnswer(): string
    {
        $lines = file(__DIR__ . '/files/day02.txt');

        $games = $this->interpretLines($lines);

        $maxAvailable = [
            'red' => 12,
            'green' => 13,
            'blue' => 14
        ];

        $possibleSum = 0;
        foreach ($games as $i => $game) {
            if ($this->isGamePossible($game, $maxAvailable)) {
                $possibleSum += $i+1;
            }
        }

        return $possibleSum;
    }

    private function isGamePossible(array $draws, array $maxAvailableDice): bool {
        foreach ($draws as $i => $dices) {
            foreach ($dices as $dice) {
                if ($dice['num'] > $maxAvailableDice[$dice['color']]) {
                    //echo "Draw $i not possible, because " . $dice['color'] . ": " . ($dice['num'] . " > " . $maxAvailableDice[$dice['color']]) . PHP_EOL;
                    return false;
                }
            }
        }
        return true;
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