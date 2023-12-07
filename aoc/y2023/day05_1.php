<?php

namespace aoc\y2023;

use src\AbstractRiddle;

class day05_1 extends AbstractRiddle {

    /** @var int[] */
    protected array $seeds = [];
    protected array $maps = [];


    public function getRiddleDescription(): string
    {
        return 'Which location is the lowest for the given seeds by following through the various maps?';
    }


    public function getRiddleAnswer(): string
    {
        $lines = file(__DIR__ . '/files/day05.txt');

        $this->parseLines($lines);

        $locations = [];
        foreach ($this->seeds as $seed) {
            $locations[] = $this->recursiveMapping($seed, 'seed', 'location');
        }

        return min(...$locations);
    }


    protected function recursiveMapping(int $value, string $sourceDataType, string $targetDataType): int {
        $matchingMap = null;

        foreach ($this->maps as $map) {
            if($map['source'] === $sourceDataType) {
                $matchingMap = $map;
                break;
            }
        }

        $newValue = $this->mapValue($matchingMap, $value);
        if ($matchingMap['destination'] === $targetDataType) {
            return $newValue;
        }
        return $this->recursiveMapping($newValue, $matchingMap['destination'], $targetDataType);
    }


    /**
     * @param array $map
     * @param int $value
     * @return int
     */
    protected function mapValue(array $map, int $value): int {
        foreach ($map['schemes'] as $scheme) {
            $sourceRangeStart = $scheme['sourceRangeStart'];
            $sourceRangeEnd = $sourceRangeStart + $scheme['range'] - 1;
            $destinationRangeStart = $scheme['destinationRangeStart'];

            if ($value >= $sourceRangeStart && $value <= $sourceRangeEnd) {
                $offset = $value - $sourceRangeStart;
                return $destinationRangeStart + $offset;
            }
        }
        return $value;
    }

    /**
     * @param string[] $lines
     * @return void
     */
    protected function parseLines(array $lines): void {
        $seedLine = array_splice($lines, 0,1)[0];
        $this->parseSeedList($seedLine);

        $waitingForMap = true;
        $currentMapIndex = -1;

        foreach ($lines as $line) {
            $line = trim($line);
            if($line === '') {
                $waitingForMap = true;
                continue;
            }

            if ($waitingForMap) {
                $waitingForMap = false;
                // parse header
                preg_match('/^(\D+)-to-(\D+) map:$/', $line, $matches);
                $mapEntry = [
                    'source' => $matches[1],
                    'destination' => $matches[2],
                    'schemes' => []
                ];
                $currentMapIndex = count($this->maps);
                $this->maps[] = $mapEntry;
            }
            else {
                // parse map line
                [$mapStart, $valueStart, $range] = explode(' ', $line, 3);
                $this->maps[$currentMapIndex]['schemes'][] = [
                    'destinationRangeStart' => $mapStart,
                    'sourceRangeStart' => $valueStart,
                    'range' => $range,
                ];
            }
        }
    }

    protected function parseSeedList(string $seedLine): void {
        $seedList = substr($seedLine, strlen('seeds: '));
        $this->seeds = array_map(static function ($el) {
            return (int)$el;
        }, array_values(array_filter(explode(' ', $seedList))));
    }
}