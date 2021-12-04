Disclaimer
==
This repository contains my answers to the "Advent of code" project. 
All code is made by myself, but the puzzles belong completely to https://adventofcode.com/ . 
I think, Advent of code is a wonderful project, please support them! 

The answers will only be uploaded after the daily leaderboard is filled, to prevent any influence.
Yes, i know that there are better ways to do some of the tasks than you will find here. But i use this project for presentation and other purposes as well, so some answers will be unnecessary long or not optimized. 

How to use:
--

1) Create a folder inside the `aoc` directory, called `y[year]` if it does not exist yet
2) Create a file inside this directory, called `day[day]_[task].php` with day being any number and task being either 1 or 2
3) Fill the newly created file with a class, that complete name (namespace+class) corresponds to the file structure (see existing riddles)
4) Extend the class AbstractRiddle and fill out the method stubs

You´re finished! Now call your riddle with `php index.php [year] [day] [task]` or just `php index.php`

Requirements
--
This project is created and maintained in php8, but for the most part php7.4 will work as well
