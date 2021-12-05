<?php

namespace aoc\y2020;

use src\AbstractRiddle;

class day04_1 extends AbstractRiddle {

    public const REQUIRED_FIELDS = [
        'byr',
        'iyr',
        'eyr',
        'hgt',
        'hcl',
        'ecl',
        'pid',
        //'cid'
    ];

    function getRiddleDescription(): string
    {
        return 'Count the number of valid passports - those that have all required fields. Treat cid as optional. In your batch file, how many passports are valid?';
    }

    function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day04.txt');

        $passports = [];
        $passportData = [];
        foreach($lines as $line) {
            if($line == '') {
                $passports[] = $this->getDataFromPassport(implode(' ', $passportData));
                $passportData = [];
            }
            else {
                $passportData[] = $line;
            }
        }
        $passports[] = $this->getDataFromPassport(implode(' ', $passportData));



        $validPassports = 0;
        foreach($passports as $n => $passportData) {
            if($this->validatePassportData($passportData)) {
                $validPassports++;
            }
        }

        return $validPassports;
    }


    protected function getDataFromPassport(string $passport): array {
        $data = [];
        $parts = array_filter(explode(' ', $passport));
        foreach($parts as $part) {
            list($key, $value) = explode(':', $part);
            $data[$key] = $value;
        }

        return $data;
    }

    protected function validatePassportData(array $passportData): bool {
        $fields = array_keys($passportData);
        $missingFields = array_diff(self::REQUIRED_FIELDS, $fields);

        return empty($missingFields);
    }

}