#!/bin/bash

# initialize variable from arguments
year=$1
day=$2
task=$3


# ensure variables are filled
while [ -z "$year" ]; do
  echo "Missing year, please select one: [2000-2100]";
  read -p "> " year
done

while [ -z "$day" ]; do
  echo "Missing day, please select one: [1-25]";
  read -p "> " day
done

while [ -z "$task" ]; do
  echo "Missing task, please select one: [1,2]";
  read -p "> " task
done

# make sure the day has the right format
if [[ ${day} -lt 2 ]] ; then
    day="0${day}"
fi



path="$(pwd)/aoc/y${year}/day${day}_${task}."

matchingFiles=$(ls "$path"* 2>/dev/null)
firstMatch=$(echo $matchingFiles | awk '{print $1}')

if [ -z "$firstMatch" ]; then
    echo "There is no matching solution for the task ${year}/${day}_${task}!"
    echo "Make sure, you are in the root directory of this project"
    exit
fi


print_header () {
  echo "------------------------------------------------------------";
  echo "Year: ${year}   |   Day: ${day}  |   Task: ${task}";
  echo "------------------------------------------------------------";
}


fileExtension="${firstMatch##*.}"

case "$fileExtension" in

    php)
      print_header
      php src/PHP/index.php $year $day $task
      ;;

    ts)
      cd src/JS
      npm run build 1> /dev/null
      print_header
      node build/src/JS/index.js $year $day $task
      ;;

    *)
      echo "There is no matching executor for filetype ${fileExtension}!"
      ;;
esac