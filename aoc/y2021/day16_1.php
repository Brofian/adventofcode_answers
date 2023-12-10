<?php

namespace aoc\y2021;

use src\PHP\AbstractRiddle;

class day16_1 extends AbstractRiddle {

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

    protected int $sumOfVersions = 0;


    public function getRiddleDescription(): string
    {
        return 'What is the lowest total risk of any path from the top left to the bottom right?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day16.txt', (function($line) {
            return str_split(trim($line));
        }));
        $bits = $this->fromHexToBinary($lines[0]);

        $packets = $this->interpretPackets($bits);

        return $this->sumOfVersions;
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
        $this->sumOfVersions += $packetVersion;
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
                return $packets;
            }
            else {
                $numberOfSubPackets = $this->fromBinaryToDec($this->getAndRemoveCharsFromString($binaryData, 11));
                $packets = $this->interpretPackets($binaryData, $numberOfSubPackets);
                //var_dump('Packets by number: ' . json_encode($packets));
                return $packets;
            }

        }
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