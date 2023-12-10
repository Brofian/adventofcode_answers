<?php

namespace aoc\y2021;

use src\PHP\AbstractRiddle;

class day08_2 extends AbstractRiddle {

    // stores the code for each number from 1-9
    /** @var string[]  */
    protected array $decipheredNumbers = [];

    //stores the numbers of the four digit code
    /** @var int[]   */
    protected array $decipheredOutputs = [];

    public function getRiddleDescription(): string
    {
        return 'What do you get if you add up all of the output values?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day08.txt', (function($line) {
            list($numbers, $outputs) = explode('|', trim($line));
            return [
                'numbers' => explode(' ', trim($numbers)),
                'outputs' => explode(' ', trim($outputs))
            ];
        }));

        // numbers is an array of 10 strings, that correspond to the codes for 0 through 9
        // outputs is an array of 4 strings, that correspond to the actual output values, we want to decipher


        $totalOutputValues = [];
        foreach($lines as $line) {
            $this->decipheredOutputs = [];

            //find the real number for every number code
            $this->decipherNumbers($line['numbers']);

            //decipher the output with the given number-codes
            $this->decipherOutput($line['outputs']);

            //concat output numbers and add them to the total output values
            $totalOutputValues[] = int_array_to_int($this->decipheredOutputs);
        }

        return array_sum($totalOutputValues);
    }


    /**
     * @param string[] $numbers
     */
    protected function decipherNumbers(array $numbers): void {

        //find the connection from the codes to the numbers 1,4,7,8
        foreach($numbers as $key => $code) {
            $clearNumber = $this->getClearNumberFrom1478($code);
            if($clearNumber !== -1) {
                $this->decipheredNumbers[$clearNumber] = $code;
                unset($numbers[$key]);
            }
        }

        // now we have found the numbers 1,4,7,8 and are missing 2,3,5,6,9,0
        //    _
        //  | _ |
        //      |
        $combined4and7 = $this->decipheredNumbers[4] . $this->decipheredNumbers[7];

        foreach($numbers as $key => $number) {
            //find a number, that completely clears $combined4and7 (only the 9 and 8 are capable of this. And the 8 is already out)
            $remainingChars = str_remove_chars($combined4and7, $number);
            if(strlen($remainingChars) == 0) {
                $this->decipheredNumbers[9] = $number;
                unset($numbers[$key]);
                break;
            }
        }

        // now we have found the numbers 1,4,7,8,9 and are missing 2,3,5,6,0


        // now we can find the difference between the 9 with and without the bottom char
        $bottomChar = str_remove_chars($this->decipheredNumbers[9], $combined4and7);

        //   _
        //     |
        //   _ |
        $topBottomAndRightTopAndRightBottom = $this->decipheredNumbers[7] . $bottomChar;

        foreach($numbers as $key => $number) {
            //find a number, that is cleared completely except one char by $tempTopBottomAndRightTopAndRightBottom (only the 3 is capable of this at this point)
            $remainingChars = str_remove_chars($number, $topBottomAndRightTopAndRightBottom);
            if(strlen($remainingChars) == 1) {
                $this->decipheredNumbers[3] = $number;
                unset($numbers[$key]);
                break;
            }
        }


        // now we have found the numbers 1,3,4,7,8,9 and are missing 2,5,6,0

        $bottomLeftChar = str_remove_chars($this->decipheredNumbers[8], $this->decipheredNumbers[9]);
        $middleChar = str_remove_chars( $this->decipheredNumbers[3], $this->decipheredNumbers[7].$bottomChar);

        foreach($numbers as $key => $number) {
            if(strlen($number) == 6) {
                //either 0 or 6 because they have six segments
                if(str_contains($number, $middleChar)) {
                    $this->decipheredNumbers[6] = $number;
                }
                else {
                    $this->decipheredNumbers[0] = $number;
                }
            }
            else {
                //either 2 or 5 because they have 5 segments
                if(str_contains($number, $bottomLeftChar)) {
                    $this->decipheredNumbers[2] = $number;
                }
                else {
                    $this->decipheredNumbers[5] = $number;
                }
            }
        }


        // now we have found the numbers 1,2,3,4,5,6,7,8,9,0 and are missing none! yay!

        // lets sort them. Just for the sake of sorting...
        ksort($this->decipheredNumbers);
    }


    /**
     * Checks if the letters, contained in two strings, are the same
     * @param string $code1
     * @param string $code2
     * @return bool
     */
    protected function codeStringEqualsCodeString(string $code1, string $code2): bool {
        return str_compare_letters($code1, $code2);
    }


    /**
     * Checks for each ciphered output, which ciphered number matches with it
     * @param string[] $outputs
     */
    protected function decipherOutput(array $outputs): void {

        foreach($outputs as $key => $code) {
            foreach($this->decipheredNumbers as $number => $numCode) {
                if($this->codeStringEqualsCodeString($code, $numCode)) {
                    $this->decipheredOutputs[$key] = $number;
                    break;
                }
            }
        }


    }

    /**
     * A simple way to get the real number of a ciphered number, if it is 1,4,7 or 8. Any other number returns -1
     *
     * @param string $code
     * @return int
     */
    protected function getClearNumberFrom1478(string $code): int
    {
        switch (strlen($code)) {
            case 2:
                return 1;
            case 4:
                return 4;
            case 3:
                return 7;
            case 7:
                return 8;
            default:
                return -1;
        }
    }

}