<?php

namespace aoc\y2022;

use Exception;
use src\AbstractRiddle;

class day08_1 extends AbstractRiddle {

    public function getRiddleDescription(): string
    {
        return 'how many trees are visible from outside the grid?';
    }

    public function getRiddleAnswer(): string
    {
        $trees = $this->readLinesOfFile(__DIR__ . '/files/day08.txt', (static function($line) {return str_split(trim($line));}));

        // we don't need to calculate the outer tree, so just start of with them
        $visibleTrees = count($trees) * 2 + (count($trees[0])-2) * 2;

        for($y = 1, $yMax = count($trees) - 1; $y < $yMax; $y++) {
            for($x = 1, $xMax = count($trees[0]) - 1; $x < $yMax; $x++) {

                $treeSize = $trees[$y][$x];

                $col = array_column($trees, $x);
                $row = $trees[$y];

                $colUp    = array_slice($col, 0, $y);
                $colDown  = array_slice($col, $y+1);
                $rowLeft  = array_slice($row, 0, $x);
                $rowRight = array_slice($row, $x+1);

                $visible =
                    empty(array_filter($colUp,    static function ($tree) use ($treeSize) { return $tree >= $treeSize; })) ||
                    empty(array_filter($colDown,  static function ($tree) use ($treeSize) { return $tree >= $treeSize; })) ||
                    empty(array_filter($rowLeft,  static function ($tree) use ($treeSize) { return $tree >= $treeSize; })) ||
                    empty(array_filter($rowRight, static function ($tree) use ($treeSize) { return $tree >= $treeSize; }));

                if($visible) {
                    $visibleTrees++;
                }
            }
        }


        return "$visibleTrees";
    }

}