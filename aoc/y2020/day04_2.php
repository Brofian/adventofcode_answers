<?php

namespace aoc\y2020;

use src\PHP\AbstractRiddle;

class day04_2 extends AbstractRiddle {

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

    public const ECL_VALUES = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];

    public function getRiddleDescription(): string
    {
        return 'Count the number of valid passports - those that have all required fields and valid values. Continue to treat cid as optional. In your batch file, how many passports are valid?';
    }

    public function getRiddleAnswer(): string
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

        if(!empty($missingFields)) {
            return false;
        }


        foreach($passportData as $field => $value) {
            switch ($field) {
                case 'byr':
                    if (!is_numeric($value) || $value < 1920 || $value > 2002) return false;
                    break;

                case 'iyr':
                    if (!is_numeric($value) || $value < 2010 || $value > 2020) return false;
                    break;

                case 'eyr':
                    if (!is_numeric($value) || $value < 2020 || $value > 2030) return false;
                    break;

                case 'hgt':
                    $unit = substr($value, -2, 2);
                    $value = rtrim($value, 'cmin');
                    if(
                        !($unit == 'cm' && $value >= 150 && $value <= 193) &&
                        !($unit == 'in' && $value >= 59 && $value <= 76)
                    ) {
                        return false;
                    }
                    break;

                case 'hcl':
                    if(!preg_match('/^#[0-9|a-f]{6}$/m', $value)) return false;
                    break;

                case 'ecl':
                    if(!in_array($value, self::ECL_VALUES)) return false;
                    break;

                case 'pid':
                    if(!preg_match('/^\d{9}$/m', $value)) {
                        return false;
                    }
                    break;


                default:
                    break;
            }
        }

        return true;
    }

}