import AbstractRiddle from '../../src/JS/AbstractRiddle';

class Y2024_Day05_2 extends AbstractRiddle {

    riddle: string = "What do you get if you add up the middle page numbers after correctly ordering just those updates?";

    run(input: string[]): number {

        const rules: { [key: number]: number[] } = {};
        const updates: number[][] = [];

        // read the input
        let finishedReadingRules: boolean = false;
        for (const line of input) {
            if (line === '') {
                finishedReadingRules = true;
            } else if (!finishedReadingRules) {
                // rule
                const re = /^(\d+)\|(\d+)$/;
                const m = line.match(re);
                const [precondition, followup] = [parseInt(m[1]), parseInt(m[2])];

                // add new rule
                if (!rules[followup]) {
                    rules[followup] = [precondition];
                }
                else {
                    rules[followup].push(precondition);
                }
            } else {
                // add new update
                const updateSequence: number[] = line.split(',').map(n => parseInt(n));
                updates.push(updateSequence);
            }
        }

        // find invalid updates
        const invalidUpdates: number[][] = [];

        for (const update of updates) {
            for (let i = 0; i < update.length; i++) {
                const numToCheck = update[i];

                if (rules[numToCheck] && !rules[numToCheck].every(precondition => {
                    return !update.includes(precondition) || update.slice(0, i).includes(precondition)
                })) {
                    invalidUpdates.push(update);
                    break;
                }
            }
        }


        // reorder invalid update
        for (const invalidUpdate of invalidUpdates) {
            invalidUpdate.sort((a, b): number => {
                if (rules[a] && rules[a].includes(b)) return 1;
                if (rules[b] && rules[b].includes(a)) return -1;
                else return 0;
            });
        }

        // sum up middle numbers of the correct updates
        return invalidUpdates.reduce((carry, update) => {
            return carry + update[Math.floor(update.length / 2)]
        }, 0);
    }


}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day05_2());