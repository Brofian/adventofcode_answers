<?php

namespace aoc\y2021;

use src\AbstractRiddle;

class day05_1 extends AbstractRiddle {

    public function getRiddleDescription(): string
    {
        return 'Consider only horizontal and vertical lines. At how many points do at least two lines overlap?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day05.txt', (function($line) {
            $line = trim($line);
            preg_match_all('/\d+/m', $line, $matches);
            $matches = array_shift($matches);

            return [
                'x1' => $matches[0],
                'y1' => $matches[1],
                'x2' => $matches[2],
                'y2' => $matches[3],
            ];
        }));


        //consider only horizontal or vertical lines
        $lines = array_filter($lines, function($item) {
            return (
                $item['x1'] == $item['x2'] ||
                $item['y1'] == $item['y2']
            );
        });

        $affectedPoints = [];
        foreach($lines as $line) {
            $affectedPoints = $this->getAffectedPointsFromLine($line, $affectedPoints);
        }

        return $this->getDangerousPointCount($affectedPoints);
    }


    protected function getDangerousPointCount(array $points): int {
        $dangerousPoints = 0;

        foreach($points as $row) {
            foreach($row as $point) {
                if($point > 1) {
                    $dangerousPoints++;
                }
            }
        }

        return $dangerousPoints;
    }

    protected function getAffectedPointsFromLine(array $line, array $points): array {
        $xStart = min($line['x1'], $line['x2']);
        $yStart = min($line['y1'], $line['y2']);
        $xEnd = max($line['x1'], $line['x2']);
        $yEnd = max($line['y1'], $line['y2']);

        for($x = $xStart; $x <= $xEnd; $x++) {
            for($y = $yStart; $y <= $yEnd; $y++) {
                $points[$x][$y] = 1 + ($points[$x][$y] ?? 0);
            }
        }

        return $points;
    }



}