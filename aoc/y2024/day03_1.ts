import AbstractRiddle from '../../src/JS/AbstractRiddle';

class Y2024_Day03_1 extends AbstractRiddle {

    riddle: string = "What do you get if you add up all of the results of the multiplications?";

    run(input: string[]): number {

        const regex = /(mul\((\d{1,3}),(\d{1,3})\))/gm;

        const memory = input.join('');

        let sum = 0;

        let m;
        while ((m = regex.exec(memory)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            sum += parseInt(m[2]) * parseInt(m[3]);
        }

        return sum;
    }



}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day03_1());