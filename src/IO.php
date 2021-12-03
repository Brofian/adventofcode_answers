<?php

namespace src;

class IO {

    public static function print(string $text): void {
        echo $text;
    }

    public static function printLine(string $text): void {
        echo $text . PHP_EOL;
    }

    public static function endLine(): void {
        echo PHP_EOL;
    }

    public static function printBorder(int $length = 30): void {
        self::printLine(str_repeat('-', $length));
    }

    public static function getUserInput(string $prompt, callable $validationFunc): string
    {
        $invalidAnswer = false;
        do {
            if ($invalidAnswer) {
                echo "Invalid input, try again! ";
            }
            $answer = trim(readline($prompt));
            $invalidAnswer = !$validationFunc($answer);
        } while ($invalidAnswer);

        return $answer;
    }


}