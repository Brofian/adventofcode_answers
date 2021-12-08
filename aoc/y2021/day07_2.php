<?php

namespace aoc\y2021;

use src\AbstractRiddle;

class day07_2 extends AbstractRiddle {

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
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day07.txt', (function($line) {
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
            $totalOutputValues[] = (int)(implode('',$this->decipheredOutputs));
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
            //find a number, that completely clears abcdf (only the 9 and 8 are capable of this. And the 8 is already out)
            $remainingChars = str_replace(str_split($number), '', $combined4and7);
            if(strlen($remainingChars) == 0) {
                $this->decipheredNumbers[9] = $number;
                unset($numbers[$key]);
                break;
            }
        }

        // now we have found the numbers 1,4,7,8,9 and are missing 2,3,5,6,0



        // now we can find the difference between the 9 with and without the bottom char
        $bottomChar = str_replace(str_split($combined4and7), '', $this->decipheredNumbers[9]);

        //   _
        //     |
        //   _ |
        $topBottomAndRightTopAndRightBottom = $this->decipheredNumbers[7] . $bottomChar;

        foreach($numbers as $key => $number) {
            //find a number, that is cleared completely except one char by $tempTopBottomAndRightTopAndRightBottom (only the 3 is capable of this at this point)
            $remainingChars = str_replace(str_split($topBottomAndRightTopAndRightBottom), '', $number);
            if(strlen($remainingChars) == 1) {
                $this->decipheredNumbers[3] = $number;
                unset($numbers[$key]);
                break;
            }
        }


        // now we have found the numbers 1,3,4,7,8,9 and are missing 2,5,6,0


        $bottomLeftChar = str_replace(str_split($this->decipheredNumbers[9]), '', $this->decipheredNumbers[8]);

        foreach($numbers as $key => $number) {
            $remainingChars = str_replace(str_split($number), '', $this->decipheredNumbers[8]);
            if(strlen($remainingChars) == 2) {
                //this number is either 2 or 5, because 0 or 6 would only leave one remaining char

                if(strpos($remainingChars, $bottomLeftChar) !== false) {
                    //the bottom left char was not removed, so the only possible number is 5
                    $this->decipheredNumbers[5] = $number;
                }
                else {
                    //the bottom left char was removed, so the only possible number is 5
                    $this->decipheredNumbers[2] = $number;
                }
                unset($numbers[$key]);

            }
        }


        // now we have found the numbers 1,2,3,4,5,7,8,9 and are missing 6,0

        foreach($numbers as $key => $number) {
            // now we have only two numbers left: 0 and 6. So we just have to check, if they remove both parts of 1
            $remainingChars = str_replace(str_split($number), '', $this->decipheredNumbers[1]);
            if(strlen($remainingChars) == 0) {
                //0
                $this->decipheredNumbers[0] = $number;
                unset($numbers[$key]);
            }
            else {
                //6
                $this->decipheredNumbers[6] = $number;
                unset($numbers[$key]);
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
        $code1Arr = str_split($code1);
        sort($code1Arr);
        $code2Arr = str_split($code2);
        sort($code2Arr);

        return empty(array_diff($code1Arr, $code2Arr)) && empty(array_diff($code2Arr, $code1Arr));
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
    protected function getClearNumberFrom1478(string $code): int {
        switch(strlen($code)) {
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