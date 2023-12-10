<?php

namespace src\PHP;

class Controller
{

    protected string $rootDir = '';
    protected array $ignoredDirs = ['.', '..', 'src', 'files'];
    protected string $year;
    protected string $day;
    protected string $task;


    public function __construct(string $argYear, string $argDay, string $argTask)
    {
        $this->rootDir = dirname(__DIR__) . '/../aoc';
        $this->year = $argYear;
        $this->day = $argDay;
        $this->task = $argTask;
    }

    public function init()
    {
        $year = $this->getYear();
        $day = $this->getDay($year);
        $task = $this->getTask($year, $day);

        //   aoc\y[year]\day[day]_[task]
        $class = 'aoc\\y'.$year.'\\day'.$day.'_'.$task;

        /** @var AbstractRiddle $riddle */
        $riddle = new $class();


        IO::printLine('Language: ');
        IO::printLine('   > PHP');
        IO::printLine('Riddle: ');
        IO::printLine('   > ' . $riddle->getRiddleDescription());
        IO::printLine('Answer: ');

        $stopwatch = new Stopwatch();
        $stopwatch->start();
        $answer = $riddle->getRiddleAnswer();
        $stopwatch->stop();

        IO::printLine('   > ' . $answer);
        IO::printLine('   > in ' . $stopwatch->toMs());

    }

    protected function getTask(string $year, string $day): string {
        $availableDays = array_values(array_diff(scandir($this->rootDir.'/y'.$year), $this->ignoredDirs));
        $taskRegex = '/^day'.$day.'_([1,2]).php$/m';

        $availableTasks = array_map(function($item) use ($taskRegex) {
            preg_match($taskRegex, $item, $matches);
            if(empty($matches)) {
                return null;
            }
            return $matches[1];
        }, $availableDays);
        $availableTasks = array_filter($availableTasks);

        if($this->task != '' && in_array($this->task, $availableTasks)) {
            return $this->task;
        }

        $task = IO::getUserInput('Which task? ('.implode(',', $availableTasks).') ', (
            function($answer) use ($availableTasks) {
                return in_array($answer, $availableTasks);
            })
        );

        $this->task = $task;
        return $task;
    }


    protected function getDay(string $year): string {
        $availableDays = array_values(array_diff(scandir($this->rootDir.'/y'.$year), $this->ignoredDirs));
        $dayRegex = '/^day([0-9]+)_[1,2].php$/m';
        $availableDays = array_map(function($item) use ($dayRegex) {
            preg_match($dayRegex, $item, $matches);
            return empty($matches) ? -1 : $matches[1];
        }, $availableDays);
        $availableDays = array_unique($availableDays);
        $availableDays = array_filter($availableDays, static function ($day) { return $day > 0; });


        if($this->day != '' && in_array($this->day, $availableDays)) {
            return $this->day;
        }

        $day = IO::getUserInput('Which day? ('.implode(',', $availableDays).') ', (
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

        $year = IO::getUserInput('Which year? ('.implode(',', $availableYears).') ', (
            function($answer) use ($availableYears) {
                return in_array($answer, $availableYears);
            })
        );

        $this->year = $year;
        return $year;
    }



}