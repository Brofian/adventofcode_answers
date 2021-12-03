<?php

namespace src;

abstract class AbstractRiddle {

    abstract function getRiddleDescription(): string;

    abstract function getRiddleAnswer(): string;

}