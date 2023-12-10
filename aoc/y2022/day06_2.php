<?php

namespace aoc\y2022;

use src\PHP\AbstractRiddle;

class day06_2 extends AbstractRiddle {

    public function getRiddleDescription(): string
    {
        return 'How many characters need to be processed before the first start-of-message marker is detected?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day06.txt', (static function($line) {return trim($line, "\n\r");}));

        $streamBuffer = reset($lines);
        $chars = str_split($streamBuffer);

        $firstStartOfPacketMarker = 0;

        $charCount = count($chars);
        $lastFourChars = array_slice(["_",...$chars], 0, 14);
        for($i = 3; $i < $charCount; $i++) {
            $lastFourChars[] = $chars[$i];
            array_shift($lastFourChars);
            //echo implode('',$lastFourChars).PHP_EOL;

            if (count(array_unique([...$lastFourChars])) === 14) {
                $firstStartOfPacketMarker = $i+1;
                break;
            }
        }


        return "$firstStartOfPacketMarker";
    }


}