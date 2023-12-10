<?php

namespace aoc\y2022;

use src\PHP\AbstractRiddle;

class day11_2 extends AbstractRiddle {


    public function getRiddleDescription(): string
    {
        return 'What is the level of monkey business after 10000 rounds?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day11.txt', (static function($line) {return trim($line);}));

        $monkeys = [];
        for($i = 0, $iMax = count($lines); $i < $iMax; $i += 7) {
            preg_match_all('/((\d+),? ?)/', $lines[$i+1], $items);

            $operation = substr($lines[$i+2], strlen('Operation: new = old '));
            [$operator, $value] = explode(' ', $operation);// [0 => '*' , 1 => '35']
            $operation = [
                'operator' => $operator,
                'value' => $value==='old' ? 'old' : (int) $value
            ];

            $test = (int) substr($lines[$i+3], strlen('Test: divisible by ')); // 23

            $nextMonkey = [
                0 => (int) substr($lines[$i+5], strlen('If false: throw to monkey ')),
                1 => (int) substr($lines[$i+4], strlen('If true: throw to monkey ')),
            ];

            $monkeys[] = [
                'items' => end($items),
                'operation' => $operation,
                'test' => $test,
                'nextMonkeys' => $nextMonkey,
                'inspectedItems' => 0
            ];
        }

        $tests = array_column($monkeys, 'test');
        $commonMultiple = array_product($tests);

        for($round = 1; $round <= 10000; $round++) {
            //if($round%100 === 0) echo "Runde $round" . PHP_EOL;


            for($m = 0, $mMax = count($monkeys); $m < $mMax; $m++) {
                $monkey = &$monkeys[$m];
                //echo "Monkey $m".PHP_EOL;

                /** @var int $item */
                foreach($monkey['items'] as $item) {
                    $worryLevel = $item;

                    //echo "   Monkey inspects an item with the worry level $worryLevel".PHP_EOL;

                    // inspect
                    $operationValue = $monkey['operation']['value'];
                    $operand = $operationValue==='old' ? $worryLevel : $operationValue;
                    switch($monkey['operation']['operator']) {
                        case '+':
                            $worryLevel += $operand;
                            break;
                        case '*':
                            $worryLevel *= $operand;
                            break;
                    }

                    $monkey['inspectedItems']++;

                    $worryLevel %= $commonMultiple;
                    // $worryLevel = floor($worryLevel/3);

                    // throw
                    $conditionResult = (int) ($worryLevel % $monkey['test'] === 0);
                    $nextMonkey = $monkey['nextMonkeys'][$conditionResult];
                    $monkeys[$nextMonkey]['items'][] = $worryLevel;
                }

                $monkey['items'] = [];
            }
        }

        $inspectedItems = array_column($monkeys, 'inspectedItems');

        rsort($inspectedItems);

        return "($inspectedItems[0] * $inspectedItems[1])  ".($inspectedItems[0] * $inspectedItems[1]);
    }

}