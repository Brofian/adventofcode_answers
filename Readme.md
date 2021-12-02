Disclaimer
==
This repository contains my answers to the "Advent of code" project. 
All code is made by myself, but the puzzles belong completely to https://adventofcode.com/
I think, Advent of code is a wonderful project, please support them! 

The answers will only be uploaded at least one day after the riddle to prevent any influence on the daily leaderboard.

How to use:
--

1) Create a folder inside the `aoc` directory, called `y[year]` if it does not exist yet
2) Create a file inside this directory, called `day[day].php`
3) Fill the newly created file with a class, that complete name (namespace+class) corresponds to the file structure (see existing riddles)
4) Extend the class AbstractRiddle and fill out the method stubs

You´re finished! Now call your riddle with `php index.php [year] [day]` or just `php index.php`

Requirements
--
This project is created and maintained in php8, but for the most part php7.4 will work as well