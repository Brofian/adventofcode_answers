<?php

namespace aoc\y2015;

use src\PHP\AbstractRiddle;

class day06_1 extends AbstractRiddle {

    public const OPERATION_MAP = [
        'toggle' => 0,
        'turn on' => 1,
        'turn off' => 2
    ];

    public function getRiddleDescription(): string
    {
        return 'After following the instructions, how many lights are lit?';
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
                $lights[$x][$y] = false;
            }
        }

        //apply commands
        foreach($commands as $command) {

            for($x = $command['fromX']; $x <= $command['toX']; $x++) {
                for($y = $command['fromY']; $y <= $command['toY']; $y++) {
                    switch ($command['operation']) {
                        case 0:
                            $lights[$x][$y] = !$lights[$x][$y];
                            break;
                        case 1:
                            $lights[$x][$y] = true;
                            break;
                        case 2:
                            $lights[$x][$y] = false;
                            break;
                    }
                }
            }

        }

        //count lit lights
        $count = 0;
        for($x = 0; $x < 1000; $x++) {
            for($y = 0; $y < 1000; $y++) {
                $count += (int)$lights[$x][$y];
            }
        }


        return $count;
    }

}