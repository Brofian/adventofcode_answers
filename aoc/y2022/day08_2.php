<?php

namespace aoc\y2022;

use src\PHP\AbstractRiddle;

class day08_2 extends AbstractRiddle {

    public function getRiddleDescription(): string
    {
        return 'What is the highest scenic score possible for any tree?';
    }

    public function getRiddleAnswer(): string
    {
        $trees = $this->readLinesOfFile(__DIR__ . '/files/day08.txt', (static function($line) {return str_split(trim($line));}));

        $highestScenicScore = 0;

        for($y = 1, $yMax = count($trees) - 1; $y < $yMax; $y++) {
            for($x = 1, $xMax = count($trees[0]) - 1; $x < $yMax; $x++) {

                $treeSize = $trees[$y][$x];

                $col = array_column($trees, $x);
                $row = $trees[$y];

                $colUp    = array_slice($col, 0, $y);
                $colDown  = array_slice($col, $y+1);
                $rowLeft  = array_slice($row, 0, $x);
                $rowRight = array_slice($row, $x+1);

                $viewUp = 0;
                for($i = count($colUp)-1; $i >= 0; $i--) {
                    $viewUp++;
                    if($colUp[$i] >= $treeSize) break;
                }

                $viewLeft = 0;
                for($i = count($rowLeft)-1; $i >= 0; $i--) {
                    $viewLeft++;
                    if($rowLeft[$i] >= $treeSize) break;
                }

                $viewDown = 0;
                for($i = 0, $iMax = count($colDown); $i < $iMax; $i++) {
                    $viewDown++;
                    if($colDown[$i] >= $treeSize) break;
                }

                $viewRight = 0;
                for($i = 0, $iMax = count($rowRight); $i < $iMax; $i++) {
                    $viewRight++;
                    if($rowRight[$i] >= $treeSize) break;
                }

                $scenicScore = $viewUp * $viewDown * $viewLeft * $viewRight;
                $highestScenicScore = max($scenicScore, $highestScenicScore);
            }
        }


        return "$highestScenicScore";
    }

}