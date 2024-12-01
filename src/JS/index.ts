import AbstractRiddle from "./AbstractRiddle";
import {performance} from 'perf_hooks';

const year = process.argv[2];
const day = process.argv[3];
const task = process.argv[4];

function log(...vars: any[]): void {
    console.log(...vars);
}

if (!year || !day || !task) {
    console.error("Missing arguments!");
}
else {
    const filePath = `../../aoc/y${year}/day${day}_${task}.js`;
    try {
        const modulePromise = import(filePath);
        modulePromise.then(module => {
            const task: AbstractRiddle = module.default;

            task.setRiddleTime(year, day);
            log("Language:");
            log("   > Typescript");
            log("Riddle:");
            log("   > " + task.riddle);

            const input = task.readInput();
            const start = performance.now();
            const answer = task.run(input);
            const end = performance.now();

            log("Answer:");
            log("   > " + answer);
            log(`   > in ${end - start}ms`);
        });
    }
    catch(err) {
        console.error(`Cannot load file under path "${filePath}"`);
    }
}