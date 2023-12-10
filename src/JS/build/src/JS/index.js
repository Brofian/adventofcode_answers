"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const perf_hooks_1 = require("perf_hooks");
const year = process.argv[2];
const day = process.argv[3];
const task = process.argv[4];
function log(...vars) {
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
            const task = module.default.default;
            log("Language:");
            log("   > Typescript");
            log("Riddle:");
            log("   > " + task.riddle);
            const start = perf_hooks_1.performance.now();
            const answer = task.run();
            const end = perf_hooks_1.performance.now();
            log("Answer:");
            log("   > " + answer);
            log(`   > in ${end - start}ms`);
        });
    }
    catch (err) {
        console.error(`Cannot load file under path "${filePath}"`);
    }
}
