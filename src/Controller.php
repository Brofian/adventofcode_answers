<?php

namespace src;

class Controller
{

    protected string $rootDir = '';
    protected array $ignoredDirs = ['.', '..', 'src', 'files'];
    protected string $year;
    protected string $day;


    public function __construct(string $argYear, string $argDay)
    {
        $this->rootDir = dirname(__DIR__) . '/aoc';
        $this->year = $argYear;
        $this->day = $argDay;
    }

    public function init()
    {
        $year = $this->getYear();
        $day = $this->getDay($year);

        $class = "aoc\\y$year\\day$day";

        /** @var AbstractRiddle $riddle */
        $riddle = new $class();

        echo PHP_EOL . PHP_EOL;
        echo str_repeat('-', 50). PHP_EOL;
        echo "Year: $year   |   Day: $day". PHP_EOL;
        echo str_repeat('-', 50). PHP_EOL;
        echo 'Riddle: '. PHP_EOL;
        echo '   > ' . $riddle->getRiddleDescriptionA(). PHP_EOL;
        echo 'Answer: '. PHP_EOL;
        echo '   > ' . $riddle->getRiddleAnswerA(). PHP_EOL;
        echo str_repeat('-', 50). PHP_EOL;
        echo 'Riddle: '. PHP_EOL;
        echo '   > ' . $riddle->getRiddleDescriptionB(). PHP_EOL;
        echo 'Answer: '. PHP_EOL;
        echo '   > ' . $riddle->getRiddleAnswerB(). PHP_EOL;
    }

    protected function getDay(string $year): string {
        $availableDays = array_values(array_diff(scandir($this->rootDir.'/y'.$year), $this->ignoredDirs));
        $dayRegex = '/^day([0-9]+).php$/m';
        $availableDays = array_map(function($item) use ($dayRegex) {
            preg_match($dayRegex, $item, $matches);
            return $matches[1];
        }, $availableDays);

        if($this->day != '' && in_array($this->day, $availableDays)) {
            return $this->day;
        }

        $day = $this->getUserInput('Which day? ('.implode(',', $availableDays).') ', (
            function($answer) use ($availableDays) {
                return in_array($answer, $availableDays);
            })
        );

        $this->day = $day;
        return $day;
    }

    protected function getYear(): string {
        $availableYears = array_values(array_diff(scandir($this->rootDir), $this->ignoredDirs));
        $availableYears = array_map(function($item) {
            return ltrim($item, 'y');
        }, $availableYears);

        if($this->year != '' && in_array($this->year, $availableYears)) {
            return $this->year;
        }

        $year = $this->getUserInput('Which year? ('.implode(',', $availableYears).') ', (
            function($answer) use ($availableYears) {
                return in_array($answer, $availableYears);
            })
        );

        $this->year = $year;
        return $year;
    }

    protected function getUserInput(string $prompt, callable $validationFunc): string
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