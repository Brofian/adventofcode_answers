<?php

namespace aoc\y2023;

use src\AbstractRiddle;

class day04_1 extends AbstractRiddle {


    public function getRiddleDescription(): string
    {
        return 'Calculate the points by comparing the winning numbers to the ticket numbers';
    }

    public function getRiddleAnswer(): string
    {
        $lines = file(__DIR__ . '/files/day04.txt');

        return $this->parseLines($lines);
    }


    protected function parseLines(array $lines): int {
        $sum = 0;

        foreach ($lines as $line) {
            [, $line] = explode(':', $line);
            [$winningNumberLine, $yourNumberLine] = explode('|', $line);

            $winningNumbers = array_map(static function($el) {
                return (int)trim($el);
            }, array_values(array_filter(explode(' ', trim($winningNumberLine)))));

            $yourNumbers = array_map(static function($el) {
                return (int)trim($el);
            }, array_values(array_filter(explode(' ', trim($yourNumberLine)))));

            $sum += $this->calculateWinningValue($winningNumbers, $yourNumbers);
        }

        return $sum;
    }

    /**
     * @param int[] $winningNumbers
     * @param int[] $yourNumbers
     * @return int
     */
    protected function calculateWinningValue(array $winningNumbers, array $yourNumbers): int {
        $points = 0;

        // echo json_encode($winningNumbers, JSON_THROW_ON_ERROR) . ' -> ' . json_encode($yourNumbers) . PHP_EOL;

        foreach ($winningNumbers as $winningNumber) {
            $i = array_search($winningNumber, $yourNumbers, true);
            if ($i !== false) {
                $points = $points === 0 ? 1 : ($points * 2);
                // remove match
                //array_splice($yourNumbers, $i, 1);
                $yourNumbers = array_filter($yourNumbers, static function($el) use ($winningNumber) {
                    return $el !== $winningNumber;
                });
            }
        }

        return $points;
    }

}