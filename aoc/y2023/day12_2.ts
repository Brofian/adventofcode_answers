import AbstractRiddle from '../../src/JS/AbstractRiddle';

type SpringToken = ('.'|'#'|'?');
type SpringRow = {
    springs: string,
    continuousDamages: number[]
};

type SolutionPerNumber = {[key: string]: number};
type CacheEntry = {
    [key: string]: SolutionPerNumber
};

class Y2023_Day12_2 extends AbstractRiddle {

    riddle: string = "How many possible configurations do exist?";

    steps: number = 0;

    cache: CacheEntry = {};

    run(): number {
        const lines: SpringRow[] = this.readInput().filter(el => el !== "").map(line => {
            const parts = line.split(' ');
            const springs = parts[0];
            const groups = parts[1].split(',').map(n => parseInt(n));

            return {
                springs: springs+'?'+springs+'?'+springs+'?'+springs+'?'+springs,
                continuousDamages: [...groups,...groups,...groups,...groups,...groups]
            };
        });


        let sum = 0;
        let lineNo = 0;
        for (const line of lines) {
            lineNo++;
            this.steps = 0;
            sum += this.solveLineMatchUp(line.springs, line.continuousDamages);
            console.log(`Solving line ${lineNo} in ${this.steps} steps...`);
        }

        return sum;
    }

    protected createCacheEntry(line: string, gKey: string, score: number) {
        if (!this.cache[line]) {
            this.cache[line] = {
                [gKey]: score
            }
        }
        this.cache[line][gKey] = score;
    }


    protected solveLineMatchUp(line: string, groupsToPlace: number[], groupProgress: number = 0): number {
        this.steps++;

        // check for cache entries
        const gKey = groupsToPlace.join('.') + '_' + groupProgress;
        if (line in this.cache && gKey in this.cache[line]) {
            return this.cache[line][gKey];
        }


        // end of recursion
        if (line.length === 0) {
            // if we reach the end of the line and have no groups left, we found a configuration
            return (groupsToPlace.length === 0) ? 1 : 0;
        }

        if (groupsToPlace.length === 0) {
            // if we have found all groups, this is a valid configuration if no damaged springs are following
            return line.split('').every(c => c !== '#') ? 1 : 0;
        }

        // process the next character
        switch (line[0] as SpringToken) {

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
                const asDamaged = this.solveLineMatchUp('#'+line.slice(1), groupsToPlace, groupProgress);
                const asFunctional = this.solveLineMatchUp('.'+line.slice(1), groupsToPlace, groupProgress);

                this.createCacheEntry(line, gKey, asDamaged + asFunctional);

                return asDamaged + asFunctional;
        }
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2023_Day12_2());