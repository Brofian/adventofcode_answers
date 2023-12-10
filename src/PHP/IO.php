<?php

namespace src\PHP;

class IO {

    public static function print(string $text): void {
        echo $text;
    }

    public static function printLine(string $text): void {
        self::print($text . PHP_EOL);
    }

    public static function endLine(): void {
        self::print(PHP_EOL);
    }

    public static function printBorder(int $length = 30): void {
        self::printLine(str_repeat('-', $length));
    }

    public static function printError(string $text): void {
        self::printLine("\e[0;31m".$text."\e[0m");
    }

    public static function printOverwritableLine($text): void {
        self::print($text . "\r");
    }

    public static function getUserInput(string $prompt, callable $validationFunc): string
    {
        $invalidAnswer = false;
        do {
            if ($invalidAnswer) {
                self::print("Invalid input, try again! ");
            }
            $answer = trim(readline($prompt));
            $invalidAnswer = !$validationFunc($answer);
        } while ($invalidAnswer);

        return $answer;
    }


}