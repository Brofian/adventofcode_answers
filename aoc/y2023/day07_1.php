<?php

namespace aoc\y2023;

require_once __DIR__ .'/day07_1_lib.php';

use src\PHP\AbstractRiddle;

class day07_1 extends AbstractRiddle {

    protected const CARDS = ['2','3','4','5','6','7','8','9','T','J','Q','K','A'];

    protected array $hands;

    public function getRiddleDescription(): string
    {
        return '';
    }


    public function getRiddleAnswer(): string
    {
        $lines = file(__DIR__ . '/files/day07.txt');

        $this->parseLines($lines);

        usort($this->hands, static function($a, $b) {
            return self::getType($a) > self::getType($b);
        });


        return 0;
    }


    protected static function getType(array $hand): CardType {
        $cardNumbers = [];
        foreach ($hand as $card) {
            $cardNumbers[$card] = ($cardNumbers[$card] ?? 0)+1;
        }

        switch (count($cardNumbers)) {
            case 1:
                return CardType::FIVE_OF_A_KIND;
            case 2:
                $firstCardNumbers = reset($cardNumbers);
                if ($firstCardNumbers === 1 || $firstCardNumbers === 4) {
                    return CardType::FOUR_OF_A_KIND;
                }
                return CardType::FULL_HOUSE;
            case 3:
                if (in_array(3, $cardNumbers, true)) {
                    return CardType::THREE_OF_A_KIND;
                }
                return CardType::TWO_PAIRS;
            case 4:
                return CardType::ONE_PAIR;
            default:
                return CardType::HIGH_CARD;
        }
    }

    /**
     * @param string[] $lines
     * @return void
     */
    protected function parseLines(array $lines): void {
        foreach ($lines as $line) {
            [$hand,$bid] = explode(' ',$line, 2);

            $this->hands[] = [
                'hand' => str_split('', $hand),
                'bid' => (int)$bid,
            ];
        }
    }
}