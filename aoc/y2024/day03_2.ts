import AbstractRiddle from '../../src/JS/AbstractRiddle';

class Y2024_Day03_2 extends AbstractRiddle {

    riddle: string = "what do you get if you add up all of the results of just the enabled multiplications?";

    run(input: string[]): number {

        const regex = /(mul\((\d{1,3}),(\d{1,3})\))|do\(\)|don't\(\)/gm;
        const memory = input.join('');

        let sum = 0;

        let m;
        let enabled = true;
        while ((m = regex.exec(memory)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            switch (m[0].substring(0,4)) {
                case 'do()':
                    enabled = true;
                    break;
                case 'don\'':
                    enabled = false;
                    break;
                case 'mul(':
                    if (enabled) {
                        sum += parseInt(m[2]) * parseInt(m[3]);
                    }
            }
        }

        return sum;
    }



}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day03_2());