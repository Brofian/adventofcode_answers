import AbstractRiddle from '../../src/JS/AbstractRiddle';

class Y2024_Day05_1 extends AbstractRiddle {

    riddle: string = "What do you get if you add up the middle page number from those correctly-ordered updates?";

    run(input: string[]): number {

        const rules: {[key: number]: number[]} = {};
        const updates: number[][] = [];

        // read the input
        let finishedReadingRules: boolean = false;
        for (const line of input) {
            if (line === '') {
                finishedReadingRules = true;
            }
            else if (!finishedReadingRules) {
                // rule
                const re = /^(\d+)\|(\d+)$/;
                const m = line.match(re);
                const precondition = parseInt(m[1]);
                const followup = parseInt(m[2]);
                // add new rule
                if (!rules[followup])   rules[followup] = [precondition];
                else                    rules[followup].push(precondition);
            }
            else {
                // update
                const updateSequence: number[] = line.split(',').map(n => parseInt(n));
                updates.push(updateSequence);
            }
        }

        // find valid updates
        const validUpdates: number[][] = [];

        for (const update of updates) {
            let isValid = true;

            for (let i = 0; i < update.length; i++) {
                const numToCheck = update[i];

                if (rules[numToCheck] && !rules[numToCheck].every(precondition => {
                    return !update.includes(precondition) || update.slice(0,i).includes(precondition)
                })) {
                    isValid = false;
                    break;
                }
            }

            if (isValid) {
                validUpdates.push(update);
            }
        }

        // sum up middle numbers of the correct updates
        let sumOfMiddles = validUpdates.reduce((carry, update) => {
            return carry + update[Math.floor(update.length/2)]
        },0);

        return sumOfMiddles;
    }



}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day05_1());