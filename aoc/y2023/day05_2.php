<?php

namespace aoc\y2023;

use src\AbstractRiddle;

class day05_2 extends AbstractRiddle {

    /** @var array[]  */
    protected array $seeds = [];
    protected array $maps = [];


    public function getRiddleDescription(): string
    {
        return '';
    }


    public function getRiddleAnswer(): string
    {
        $lines = file(__DIR__ . '/files/day05.txt');

        $this->parseLines($lines);


        $locations = [];
        foreach ($this->seeds as $seedRange) {
            $listOfValueRanges = $this->recursiveMapping($seedRange, 'seed', 'location');
            foreach ($listOfValueRanges as $valueRange) {
                $locations[] = $valueRange[0];
            }
        }

        return min($locations);
    }


    /**
     * @param array $valueRange
     * @param string $sourceDataType
     * @param string $targetDataType
     * @return int[]
     */
    protected function recursiveMapping(array $valueRange, string $sourceDataType, string $targetDataType): array {
        $matchingMap = null;

        // find map
        foreach ($this->maps as $map) {
            if($map['source'] === $sourceDataType) {
                $matchingMap = $map;
                break;
            }
        }

        $newValueRanges = $this->mapValueRange($matchingMap, $valueRange);
        if ($matchingMap['destination'] === $targetDataType) {
            return $newValueRanges;
        }

        $mappedValueRanges = [];
        foreach ($newValueRanges as $newValueRange) {
            $mappedValueRanges[] = $this->recursiveMapping($newValueRange, $matchingMap['destination'], $targetDataType);
        }

        return array_merge(...$mappedValueRanges);
    }

    protected function splitRangeBySchemes(array $map, array $valueRange): array {
        $splitRanges = [];

        [$rangeStart, $rangeEnd] = $valueRange;

        // create split ranges, whenever a range goes over the start or end of the source range
        foreach ($map['schemes'] as $scheme) {
            $sourceRangeStart = $scheme['sourceRangeStart'];
            $sourceRangeEnd = $sourceRangeStart + $scheme['range'] - 1;

            if ($rangeStart > $sourceRangeEnd || $rangeEnd < $sourceRangeStart) {
                // this scheme does not cross the current range at all
                continue;
            }

            if ($rangeStart > $rangeEnd) {
                //echo "ERROR: " . $rangeStart . ',' . $rangeEnd . PHP_EOL;
                break;
            }


            if ($rangeStart >= $sourceRangeStart) {
                // the start of our range lies in this scheme

                if($rangeEnd > $sourceRangeEnd) {
                    // but the end of our range does not -> make a split
                    $splitRanges[] = [$rangeStart, $sourceRangeEnd];
                    $rangeStart = $sourceRangeEnd+1;
                    //echo "Found split for start, continuing with " . $rangeStart . ',' . $rangeEnd . PHP_EOL;
                }
                else {
                    // our range is fully contained in this scheme
                    //echo "Found containing scheme, continuing with " . $rangeStart . ',' . $rangeEnd . PHP_EOL;
                    $splitRanges[] = [$rangeStart, $rangeEnd];
                    break;
                }

            }
            else if($rangeEnd <= $sourceRangeEnd) {
                // the end of our range lies in this scheme, but the start does not -> make a split
                $splitRanges[] = [$sourceRangeStart, $rangeEnd];
                $rangeEnd = $sourceRangeStart-1;
                //echo "Found split for end, continuing with " . $rangeStart . ',' . $rangeEnd . PHP_EOL;
            }
            else {
                // both ends are outside of this scheme, but the values inbetween are inside
                $splitRanges[] = [$sourceRangeStart, $sourceRangeEnd];
                // we have to continue calculating two separate ranges

                //echo "Found scheme contained in current range, continuing with " . $rangeStart . ',' . $rangeEnd . PHP_EOL;

                return array_merge(
                    $splitRanges,
                    $this->splitRangeBySchemes($map, [$rangeStart, $sourceRangeStart-1]),
                    $this->splitRangeBySchemes($map, [$sourceRangeEnd+1, $rangeEnd]),
                );
            }
            /*

                        |       |
                  ---               ----
                           ---
                              ----
                       ----
             */
        }

        if ($rangeStart <= $rangeEnd) {
            $splitRanges[] = [$rangeStart, $rangeEnd];
        }


        return $splitRanges;
    }


    /**
     * @param array $map
     * @param int[] $valueRange
     * @return array[]
     */
    protected function mapValueRange(array $map, array $valueRange): array {
        $splitRanges = $this->splitRangeBySchemes($map, $valueRange);

//        echo "Split into " . count($splitRanges) . ' partial ranges' . PHP_EOL;
//        echo json_encode($valueRange) .' -> '. json_encode($splitRanges) . PHP_EOL;

        // now every range in the splitRanges list will be contained in only ONE scheme maximum

        $mappedRanges = [...$splitRanges];
        foreach ($map['schemes'] as $scheme) {
            $sourceRangeStart = $scheme['sourceRangeStart'];
            $sourceRangeEnd = $sourceRangeStart + $scheme['range'] - 1;
            $destinationRangeStart = $scheme['destinationRangeStart'];

            foreach ($splitRanges as $i => $splitRange) {
                [$rangeStart, $rangeEnd] = $splitRange;
                if ($rangeStart >= $sourceRangeStart && $rangeStart <= $sourceRangeEnd) {
                    $offset = $rangeStart - $sourceRangeStart;
                    $mappedRanges[$i] = [
                        $destinationRangeStart + $offset,
                        $destinationRangeStart + $offset + ($rangeEnd - $rangeStart)
                    ];
                }
            }
        }

        // echo json_encode($splitRanges) . ' -> ' . json_encode($mappedRanges) . PHP_EOL;

        return $mappedRanges;
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
        $seedData = array_map(static function ($el) {
            return (int)$el;
        }, array_values(array_filter(explode(' ', $seedList), static function ($el) {
            return $el !== '';
        })));

        for ($i = 0, $iMax = count($seedData); $i < $iMax; $i += 2) {
            $this->seeds[] = [
                $seedData[$i], // rangeStart
                $seedData[$i] + $seedData[$i+1] - 1, // rangeEnd
            ];
        }
    }
}