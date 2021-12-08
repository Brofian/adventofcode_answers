<?php

// this file contains some utility functions, but also definitions for PHP < 8.0

if(!function_exists('str_contains')) {
    function str_contains(string $string, string $substring): bool {
        return strpos($string, $substring) !== false;
    }
}



function str_compare_letters(string $string1, string $string2): bool {
    $string1Arr = str_split($string1);
    sort($string1Arr);
    $string2Arr = str_split($string2);
    sort($string2Arr);

    return empty(array_diff($string1Arr, $string2Arr)) && empty(array_diff($string2Arr, $string1Arr));
}


function str_remove_chars(string $string, string $charsToRemove): string {
    return str_replace(
        str_split($charsToRemove),
        '',
        $string
    );
}

function int_array_to_int(array $intArray): int {
    return (int)implode('', $intArray);
}