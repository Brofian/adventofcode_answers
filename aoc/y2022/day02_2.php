<?php

namespace aoc\y2022;

use src\PHP\AbstractRiddle;

class day02_2 extends AbstractRiddle {

    const GAME_RESULTS = [
        "A" => [ // rock
            "X" => 0 + 3,  // scissors
            "Y" => 3 + 1,  // rock
            "Z" => 6 + 2,  // paper
        ],
        "B" => [ // paper
            "X" => 0 + 1,  // rock
            "Y" => 3 + 2,  // paper
            "Z" => 6 + 3,  // scissors
        ],
        "C" => [ // scissors
            "X" => 0 + 2,  // paper
            "Y" => 3 + 3,  // scissors
            "Z" => 6 + 1,  // rock
        ],
    ];

    public function getRiddleDescription(): string
    {
        return 'what would your total score be if everything goes exactly according to your strategy guide?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day02.txt', (static function($line) {return trim($line);}));

        $points = 0;
        foreach($lines as $line) {
            $points += self::GAME_RESULTS[$line[0]][$line[2]];
        }

        return "$points";
    }

}