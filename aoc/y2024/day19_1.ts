import AbstractRiddle from '../../src/JS/AbstractRiddle';


class Y2024_Day19_1 extends AbstractRiddle {

    riddle: string = "How many designs are possible?";

    run(input: string[]): string | number | bigint {

        const availablePatterns = input.shift().split(',').map(p => p.trim());
        input.shift();
        const desiredPatterns = input;


        let possibleDesigns = 0;
        let i = 0;

        for (const desiredPattern of desiredPatterns) {

            //this.dump(`Searching for: ${desiredPattern}`);
            const relevantPatterns = availablePatterns.filter(p => desiredPattern.includes(p));

            this.dump(` - ${i++} / ${desiredPatterns.length} with ${relevantPatterns.length} relevant patterns`);

            const combination = this.findCombination(relevantPatterns, desiredPattern);
            if (combination) {
                possibleDesigns++;
            }
        }

        return possibleDesigns;
    }

    private findCombination(patterns: string[], desired: string): boolean {

        const foundCombinations: { [key: string]: boolean } = {};

        const partials: string[] = patterns
            .filter(pattern => desired.startsWith(pattern))
            .sort((a, b) => a[0].length > b[0].length ? -1 : 1);

        while (partials.length) {
            const partial = partials.pop();

            for (const pattern of patterns) {

                const combination = partial + pattern;
                if (foundCombinations[combination]) {
                    continue; // we have already checked that
                }

                if (desired.startsWith(combination)) {

                    if (desired === combination) {
                        return true;
                    }

                    partials.push(combination);
                    foundCombinations[combination] = true;
                }
            }
        }

        return false;
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day19_1());