import AbstractRiddle from '../../src/JS/AbstractRiddle';

type SpringToken = ('.'|'#'|'?');
type SpringRow = {
    springs: SpringToken[],
    continuousDamages: number[]
};

class Y2023_Day12_1 extends AbstractRiddle {

    riddle: string = "How many possible configurations do exist?";

    run(): number {
        const lines: SpringRow[] = this.readInput().filter(el => el !== "").map(line => {
            const parts = line.split(' ');
            const springs = parts[0].split('') as ('.'|'#'|'?')[];
            const groups = parts[1].split(',').map(n => parseInt(n));

            return {
                springs: springs,
                continuousDamages: groups
            };
        });


        let sum = 0;
        for (const line of lines) {

            sum += this.solveLineMatchUp(line.springs, line.continuousDamages);

        }

        return sum;
    }


    protected solveLineMatchUp(line: SpringToken[], groupsToPlace: number[], groupProgress: number = 0): number {

        // end of recursion
        if (line.length === 0) {
            // if we reach the end of the line and have no groups left, we found a configuration
            return (groupsToPlace.length === 0) ? 1 : 0;
        }

        if (groupsToPlace.length === 0) {
            // if we have found all groups, this is a valid configuration if no damaged springs are following
            return line.every(c => c !== '#') ? 1 : 0;
        }

        // process the next character
        switch (line[0]) {

            case '.':
                // did we break our current group without finishing it?
                if (groupProgress > 0) {
                    return 0;
                }

                // working spring, continue without it
                return this.solveLineMatchUp(line.slice(1), groupsToPlace, 0);

            case '#':
                // damaged spring, progress in group or finish it

                if (groupProgress+1 !== groupsToPlace[0]) {
                    // we are not finished with this group, keep searching
                    return this.solveLineMatchUp(line.slice(1), groupsToPlace, groupProgress+1);
                }

                // finished a group! Now check if this would be a valid possibility
                if (line.length > 1 && line[1] === '#') {
                    // this pattern would be to long for the current group in the next step... sadly no match
                    return 0;
                }
                else {
                    // this group was finished as intended!
                    // Keep searching for the next group, taking the space between into account
                    return this.solveLineMatchUp(line.slice(2), groupsToPlace.slice(1), 0);
                }

            case '?':
                // we don't know what this field could be, so we have to try both possibilities
                line.splice(0, 1, '#');
                const asDamaged = this.solveLineMatchUp(line, groupsToPlace, groupProgress);
                line.splice(0, 1, '.');
                const asFunctional = this.solveLineMatchUp(line, groupsToPlace, groupProgress);
                return asDamaged + asFunctional;
        }
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2023_Day12_1());