<?php

namespace aoc\y2022;

use Exception;
use src\AbstractRiddle;

class day10_1 extends AbstractRiddle {

    protected const TIMINGS = [
        'noop' => 1,
        'addx' => 2
    ];

    public function getRiddleDescription(): string
    {
        return 'What is the sum of these six signal strengths?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day10.txt', (static function($line) {return trim($line);}));

        $cycle = 0;
        $x = 1;
        $signalStrengths = 0;

        foreach($lines as $line) {
            $parts = explode(' ', $line, 2);
            $command = $parts[0];
            $number = $parts[1] ?? 0;

            $cyclesToRun = self::TIMINGS[$command];
            for($i = 0; $i < $cyclesToRun; $i++) {
                $cycle++;
                if(($cycle-20)%40 === 0) {
                    $signalStrengths += $cycle * $x;
                }
            }

            switch($command) {
                case 'addx':
                    $x += (int)$number;
                    break;
            }
        }

        return "$signalStrengths";
    }

}