<?php

namespace aoc\y2015;

use src\PHP\AbstractRiddle;

class day06_2 extends AbstractRiddle {

    public const OPERATION_MAP = [
        'toggle' => 0,
        'turn on' => 1,
        'turn off' => 2
    ];

    public function getRiddleDescription(): string
    {
        return 'What is the total brightness of all lights combined after following Santa\'s instructions?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = file(__DIR__ . '/files/day06.txt');

        //gather commands
        $commands = [];
        foreach($lines as $line) {
            preg_match('/(.*) ([0-9]*),([0-9]*) through ([0-9]*),([0-9]*)/m', $line, $matches);
            $commands[] = [
                'operation' => self::OPERATION_MAP[$matches[1]],
                'fromX' => $matches[2],
                'fromY' => $matches[3],
                'toX' => $matches[4],
                'toY' => $matches[5],
            ];
        }

        //create light array
        $lights = [];
        for($x = 0; $x < 1000; $x++) {
            $lights[$x] = [];
            for($y = 0; $y < 1000; $y++) {
                $lights[$x][$y] = 0;
            }
        }

        //apply commands
        foreach($commands as $command) {
            for($x = $command['fromX']; $x <= $command['toX']; $x++) {
                for($y = $command['fromY']; $y <= $command['toY']; $y++) {
                    switch ($command['operation']) {
                        case 0:
                            $lights[$x][$y] += 2;
                            break;
                        case 1:
                            $lights[$x][$y] += 1;
                            break;
                        case 2:
                            $lights[$x][$y] = max($lights[$x][$y]-1, 0);
                            break;
                    }
                }
            }
        }

        //count total brightness of thew lights
        $brightness = 0;
        for($x = 0; $x < 1000; $x++) {
            for($y = 0; $y < 1000; $y++) {
                $brightness += (int)$lights[$x][$y];
            }
        }


        return $brightness;
    }
}