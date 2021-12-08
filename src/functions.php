<?php

// this file contains some utility functions, but also definitions for PHP < 8.0

if(!function_exists('str_contains')) {
    /**
     * Checks, if the string contains the substring at any position
     * @param string $string
     * @param string $substring
     * @return bool
     */
    function str_contains(string $string, string $substring): bool {
        return strpos($string, $substring) !== false;
    }
}


/**
 * Takes in two strings and outputs true if they contain the same letters and the same numbers of them. False, if they dont
 * @param string $string1
 * @param string $string2
 * @return bool
 */
function str_compare_letters(string $string1, string $string2): bool {
    $string1Arr = str_split($string1);
    sort($string1Arr);
    $string2Arr = str_split($string2);
    sort($string2Arr);

    return empty(array_diff($string1Arr, $string2Arr)) && empty(array_diff($string2Arr, $string1Arr));
}

/**
 * Removes chars from the given string. The chars are passed as a string themselves
 * @param string $string
 * @param string $charsToRemove
 * @return string
 */
function str_remove_chars(string $string, string $charsToRemove): string {
    return str_replace(
        str_split($charsToRemove),
        '',
        $string
    );
}

/**
 * Converts an array of integer numbers to a single number by sticking them together and returns it
 * @param array $intArray
 * @return int
 */
function int_array_to_int(array $intArray): int {
    return (int)implode('', $intArray);
}