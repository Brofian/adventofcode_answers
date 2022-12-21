<?php

namespace aoc\y2022;

use Exception;
use src\AbstractRiddle;

class day10_2 extends AbstractRiddle {

    protected const TIMINGS = [
        'noop' => 1,
        'addx' => 2
    ];

    function getRiddleDescription(): string
    {
        return 'What eight capital letters appear on your CRT?';
    }

    function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day10.txt', (static function($line) {return trim($line);}));

        $cycle = 0;
        $x = 1;
        $screen = PHP_EOL.'|';

        foreach($lines as $line) {
            $parts = explode(' ', $line, 2);
            $command = $parts[0];

            for($i = 0; $i < self::TIMINGS[$command]; $i++) {
                $cycle++;

                $screenPosition = ($cycle%40)-1;
                $isInRange = abs($screenPosition-$x) <= 1;

                $screen .= $isInRange ? '#' : '.';

                // echo "Start cycle $cycle with ".($isInRange ? '#' : '.')." ($x -> $screenPosition)".PHP_EOL;

                if($screenPosition === -1) {
                    $screen .= "| <- Cycle $cycle".PHP_EOL."|";
                }
            }

            switch($command) {
                case 'addx':
                    $number = $parts[1] ?? 0;
                    $x += (int)$number;
                    break;
            }
        }

        return "$screen";
    }

}