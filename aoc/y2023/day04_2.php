<?php

namespace aoc\y2023;

use src\PHP\AbstractRiddle;

class day04_2 extends AbstractRiddle {

    /** @var int[]  */
    protected array $copiesOfCards = [];

    public function getRiddleDescription(): string
    {
        return 'How many cards are won in total, if every win gives you a copy of another card after?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = file(__DIR__ . '/files/day04.txt');

        $this->copiesOfCards = array_fill(0, count($lines), 1);

        return $this->parseLines($lines);
    }


    protected function parseLines(array $lines): int {
        foreach ($lines as $lineId => $line) {
            [, $line] = explode(':', $line, 2);
            [$winningNumberLine, $yourNumberLine] = explode('|', $line);

            $winningNumbers = array_map(static function($el) {
                return (int)trim($el);
            }, array_values(array_filter(explode(' ', trim($winningNumberLine)))));

            $yourNumbers = array_map(static function($el) {
                return (int)trim($el);
            }, array_values(array_filter(explode(' ', trim($yourNumberLine)))));

            $matches = $this->calculateMatches($winningNumbers, $yourNumbers);
            for ($i = 1; $i <= $matches; $i++) {
                $this->copiesOfCards[$lineId + $i] += $this->copiesOfCards[$lineId];
            }
        }

        return array_sum($this->copiesOfCards);
    }

    /**
     * @param int[] $winningNumbers
     * @param int[] $yourNumbers
     * @return int
     */
    protected function calculateMatches(array $winningNumbers, array $yourNumbers): int {
        $matches = 0;

        // echo json_encode($winningNumbers, JSON_THROW_ON_ERROR) . ' -> ' . json_encode($yourNumbers) . PHP_EOL;

        foreach ($winningNumbers as $winningNumber) {
            $i = array_search($winningNumber, $yourNumbers, true);
            if ($i !== false) {
                $matches++;
                // remove match
                //array_splice($yourNumbers, $i, 1);
                $yourNumbers = array_filter($yourNumbers, static function($el) use ($winningNumber) {
                    return $el !== $winningNumber;
                });
            }
        }

        return $matches;
    }

}