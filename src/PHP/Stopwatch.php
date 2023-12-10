<?php

namespace src\PHP;

class Stopwatch {

    protected float $startTime;
    protected float $stopTime;


    public function start(): void {
        $this->startTime = microtime(true) * 1000;
    }

    public function stop(): void {
        $this->stopTime = microtime(true) * 1000;
    }

    protected function getTime(): float {
        return $this->stopTime - $this->startTime;
    }

    public function toMs(): string {
        $ms = $this->getTime();
        return $ms.'ms';
    }

    public function toSec(): string {
        $ms = $this->getTime() / 1000;
        return $ms.'s';
    }



}