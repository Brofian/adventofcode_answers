<?php

namespace aoc\y2021;

use src\PHP\AbstractRiddle;

class day16_2 extends AbstractRiddle {

    protected const HEX_TO_BIN = [
        '0' => '0000',
        '1' => '0001',
        '2' => '0010',
        '3' => '0011',
        '4' => '0100',
        '5' => '0101',
        '6' => '0110',
        '7' => '0111',
        '8' => '1000',
        '9' => '1001',
        'A' => '1010',
        'B' => '1011',
        'C' => '1100',
        'D' => '1101',
        'E' => '1110',
        'F' => '1111',
    ];


    public function getRiddleDescription(): string
    {
        return 'What do you get if you evaluate the expression represented by your hexadecimal-encoded BITS transmission?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day16.txt', (function($line) {
            return str_split(trim($line));
        }));
        $bits = $this->fromHexToBinary($lines[0]);

        $packets = $this->interpretPackets($bits);

        return reset($packets);
    }


    protected function interpretPackets(string &$binaryData, ?int $returnAfter = null): array {

        $packets = [];
        while(strlen($binaryData) > 0) {
            if(strpos($binaryData, '1') === false) {
                break;
            }

            $newPackets = $this->interpretPacket($binaryData);
            if(!empty($newPackets)) {
                $packets[] = $newPackets;
            }

            if($returnAfter && count($packets) >= $returnAfter) {
                break;
            }
        }
        return array_merge(...$packets);

    }


    protected function interpretPacket(string &$binaryData): array {

        $packetVersion  = $this->fromBinaryToDec($this->getAndRemoveCharsFromString($binaryData, 3));
        //var_dump('version: ' . $packetVersion);
        $packetTypeId   = $this->fromBinaryToDec($this->getAndRemoveCharsFromString($binaryData, 3));
        //var_dump('type: '. $packetTypeId);

        if($packetTypeId === 4) {
            // this is a literal, so read the value
            $bitString = '';
            $pos = 6;
            do {
                $subStr = $this->getAndRemoveCharsFromString($binaryData, 5);
                $keepReading = $this->getAndRemoveCharsFromString($subStr, 1);
                $bitString .= $subStr;
                $pos += 5;
            }
            while($keepReading);
            $literal = $this->fromBinaryToDec($bitString);
            //var_dump('literal: ' . $literal);
            return [$literal];
        }
        else {
            // this is an operator
            $packetLengthTypeId = (int)$this->getAndRemoveCharsFromString($binaryData, 1);
            if($packetLengthTypeId === 0) {
                $totalLengthOfSubPackets = $this->fromBinaryToDec($this->getAndRemoveCharsFromString($binaryData, 15));
                $bitsForSubPackets = $this->getAndRemoveCharsFromString($binaryData, $totalLengthOfSubPackets);
                $packets = $this->interpretPackets($bitsForSubPackets);
                //var_dump('Packets by length: ' . json_encode($packets));
                return [$this->applyOperatorToSubPackets($packetTypeId, $packets)];
            }
            else {
                $numberOfSubPackets = $this->fromBinaryToDec($this->getAndRemoveCharsFromString($binaryData, 11));
                $packets = $this->interpretPackets($binaryData, $numberOfSubPackets);
                //var_dump('Packets by number: ' . json_encode($packets));
                return [$this->applyOperatorToSubPackets($packetTypeId, $packets)];
            }

        }

    }


    protected function applyOperatorToSubPackets(int $operatorID, $subPackets): int {

        switch ($operatorID) {
            case 0: //sum
                return array_sum($subPackets);
            case 1: //product
                $product = 1;
                foreach($subPackets as $subPacket) {
                    $product *= $subPacket;
                }
                return $product;
            case 2: //min
                return min($subPackets);
            case 3: //max
                return max($subPackets);
            case 5: //greater than
                return ($subPackets[0] > $subPackets[1]) ? 1 : 0;
            case 6: //less than
                return ($subPackets[0] < $subPackets[1]) ? 1 : 0;
            case 7: //equals
                return ($subPackets[0] == $subPackets[1]) ? 1 : 0;
        }


        var_dump($operatorID, $subPackets);

        $subPackets;
        return 1;

    }


    protected function fromHexToBinary(array $hex): string {
        $bits = [];
        foreach($hex as $char) {
            $bits[] = self::HEX_TO_BIN[$char];
        }
        return implode($bits);
    }

    protected function fromBinaryToDec(string $binary): int {
        $n = 0;
        foreach(str_split($binary) as $bit) {
            $n <<= 1;
            $n += (int)$bit;
        }
        return $n;
    }


    protected function getAndRemoveCharsFromString(string &$string, int $numChars): string {
        $sub = substr($string, 0, $numChars);
        $string = substr($string, $numChars);
        return $sub;
    }
}