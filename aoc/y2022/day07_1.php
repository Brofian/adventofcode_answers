<?php

namespace aoc\y2022;

use Exception;
use src\PHP\AbstractRiddle;

class day07_1 extends AbstractRiddle {

    public function getRiddleDescription(): string
    {
        return 'What is the sum of the total sizes of those directories?';
    }

    public function getRiddleAnswer(): string
    {
        $lines = $this->readLinesOfFile(__DIR__ . '/files/day07.txt', (static function($line) {return trim($line);}));

        // load file system
        array_shift($lines); // remove the unneccessary first line
        $fileSystem = $this->createFileSystem($lines);

        $largeFiles = [];
        $this->recursiveFolderSizeSearch($fileSystem, $largeFiles);

        return "".array_sum($largeFiles);
    }


    protected function recursiveFolderSizeSearch(fsObj $folder, &$results): void {
        if($folder->size <= 100000) {
            $results[$folder->getPath()] = $folder->size;
        }

        foreach($folder->children as $child) {
            if(!$child->isFile) $this->recursiveFolderSizeSearch($child, $results);
        }
    }

    protected function createFileSystem(array $commandLineOutput): fsObj {
        $fileSystem = new fsObj(false, 0, '/');
        $currentDirectory = &$fileSystem;

        foreach($commandLineOutput as $line) {
            if(strpos($line, '$') === 0) {
                // we have a command

                if(strpos($line, 'cd') === 2) {
                    // cd command
                    if(strpos($line, '..') === 5) {
                        // go up a directory -> we just assume, we won't go up from the root
                        $currentDirectory = &$currentDirectory->parent;
                    }
                    else {
                        $folderName = substr($line, 5);
                        $currentDirectory = &$currentDirectory->children[$folderName];
                    }
                }
                else {
                    // ls command -> ignore
                }
            }
            else {
                // adding file or directory
                if(strpos($line, 'dir') === 0) {
                    // adding directory
                    $dirname = substr($line, 4);
                    $currentDirectory->addChild(false, $dirname, 0);
                    echo "creating dir $dirname ".PHP_EOL;
                }
                else {
                    // adding file
                    [$filesize,$filename] = explode(' ', $line, 2);
                    $currentDirectory->addChild(true, $filename, (int)$filesize);
                    echo "creating file $filename with $filesize ".PHP_EOL;
                }
            }
        }
        return $fileSystem;
    }
}

class fsObj {

    private string $name;
    public int $size;
    public bool $isFile;
    public ?fsObj $parent = null;
    /** @var fsObj[] $children */
    public array $children = [];

    public function __construct(bool $isFile, int $size, string $name)
    {
        $this->isFile = $isFile;
        $this->size = $size;
        $this->name = $name;
    }

    public function addChild(bool $isFile, string $name, int $size): void
    {
        if($this->isFile) {
            throw new Exception('could not created child on file!');
        }

        $child = new fsObj($isFile, $size, $name);
        $child->parent = $this;
        $this->children[$name] = $child;

        if($isFile) {
            $this->recalculateSize();
        }
    }

    public function recalculateSize(): void {
        $size = 0;
        array_walk($this->children, static function(fsObj $child) use (&$size) {
            $size += $child->size;
        });
        $this->size = $size;

        if($this->parent) {
            $this->parent->recalculateSize();
        }
    }

    public function getPath(): string {
        $parentPath = $this->parent ? $this->parent->getPath() : '';
        return $parentPath . '/' . $this->name;
    }
}