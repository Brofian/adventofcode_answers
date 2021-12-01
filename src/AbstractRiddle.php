<?php

namespace src;

abstract class AbstractRiddle {

    abstract function getRiddleDescriptionA(): string;

    abstract function getRiddleAnswerA(): string;

    abstract function getRiddleDescriptionB(): string;

    abstract function getRiddleAnswerB(): string;


}