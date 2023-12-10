<?php

namespace aoc\y2023;

enum CardType {
    case FIVE_OF_A_KIND;
    case FOUR_OF_A_KIND;
    case THREE_OF_A_KIND;
    case FULL_HOUSE;
    case TWO_PAIRS;
    case ONE_PAIR;
    case HIGH_CARD;
}