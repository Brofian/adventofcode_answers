<?php

namespace aoc\y2021;

use src\AbstractRiddle;

class day04_1 extends AbstractRiddle {

    public function getRiddleDescription(): string
    {
        return 'To guarantee victory against the giant squid, figure out which board will win first. What will your final score be if you choose that board?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day04.txt');

        //get drawn numbers
        $drawnNumbers = explode(',', array_shift($lines));

        //extract the boards
        $boards = [];
        $boardIndex = -1;
        foreach($lines as $line) {
            if($line == '') {
                $boardIndex++;
                continue;
            }

            $row = explode(' ', $line);
            //remove empty fields and reindex
            $row = array_values(array_filter($row, (function ($item) { return $item !== ''; } )));
            //set all cells to false
            $row = array_map(function($item) {
                return [$item, false];
            }, $row);

            $boards[$boardIndex][] = $row;
        }

        //apply drawn numbers
        $winningBoard = -1;
        $lastCalledNumber = 0;
        foreach($drawnNumbers as $drawnNumber) {
            $lastCalledNumber = $drawnNumber;
            foreach($boards as &$board) {
                foreach($board as &$row) {
                    foreach($row as &$cell) {
                        if($cell[0] == $drawnNumber) {
                            $cell[1] = true;
                        }
                    }
                }
            }

            foreach ($boards as $key => $board) {
                $isWinning = $this->checkIfBoardWins($board);
                if($isWinning) {
                    $winningBoard = $key;
                    break 2;
                }
            }

        }



        if($winningBoard === -1) {
            return 'No board is winning with the given numbers';
        }


        $score = $this->getScore($boards[$winningBoard], $lastCalledNumber);

        return $score;
    }


    protected function getScore(array $board, int $lastCalledNumber): int {
        $sumOfUnmarkedFields = 0;
        foreach ($board as $row) {
            foreach ($row as $cell) {
                if(!$cell[1]) {
                    $sumOfUnmarkedFields += $cell[0];
                }
            }
        }

        return $sumOfUnmarkedFields * $lastCalledNumber;
    }


    protected function checkIfBoardWins(array $board): bool {
        //check rows
        foreach ($board as $row) {
            if($this->checkIfRowWins($row)) {
                return true;
            }
        }

        //check cols
        for($i = 0; $i < 5; $i++) {
            $col = array_column($board, $i);
            if($this->checkIfRowWins($col)) {
                return true;
            }
        }

        return false;
    }

    protected function checkIfRowWins(array $row): bool {

        foreach($row as $cell) {
            if(!$cell[1]) {
                return false;
            }
        }

        return true;
    }

}