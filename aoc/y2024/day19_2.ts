import AbstractRiddle from '../../src/JS/AbstractRiddle';


class Y2024_Day19_1 extends AbstractRiddle {

    riddle: string = "What do you get if you add up the number of different ways you could make each design?";

    run(input: string[]): string | number | bigint {

        const availablePatterns = input.shift().split(',').map(p => p.trim());
        input.shift();
        const desiredPatterns = input;

        // sort desired patterns by length and determine shortest and longest
        desiredPatterns.sort((a,b) => a.length < b.length ? -1 : 1);
        let minLength = desiredPatterns[0].length;
        let maxLength = desiredPatterns[desiredPatterns.length-1].length;

        // generate Set for O(1) lookup
        const partialDesiredPatterns = this.getPartialsSet(desiredPatterns);


        // store the available combinations with the number of permutations that produce this permutation
        let possiblePermutations: {[key: string]: number} = {};
        availablePatterns.forEach(a => possiblePermutations[a] = 1);


        // 662726441391898
        let solution = 0;

        // each iteration: add one basic pattern to each permutation
        let longestCombi = 1;
        let shortestCombi = 1;
        while (longestCombi > 0 && shortestCombi <= maxLength) {
            const nextPossiblePermutations: typeof possiblePermutations = {};
            longestCombi = 0;
            shortestCombi = 0;

            for (const permutation in possiblePermutations) {
                for (const available of availablePatterns) {

                    const combi = permutation + available;
                    if (!partialDesiredPatterns.has(combi)) {
                        continue; // this is not relevant
                    }

                    longestCombi = Math.max(longestCombi, combi.length);
                    shortestCombi = Math.min(shortestCombi, combi.length);

                    if (nextPossiblePermutations[combi]) {
                        nextPossiblePermutations[combi] += possiblePermutations[permutation];
                    }
                    else {
                        nextPossiblePermutations[combi] = possiblePermutations[permutation];
                    }
                }
            }

            let foundDesired = 0;
            if (longestCombi >= minLength) {

                // check all desired patterns, if we have found their pattern this round
                for (const desired of desiredPatterns) {
                    if (nextPossiblePermutations[desired]) {
                        // if we did, count the number of permutations, that led us here
                        solution += nextPossiblePermutations[desired];
                        foundDesired++;
                    }
                }
            }

            this.dump(`  - Longest word: ${longestCombi} with ${Object.keys(nextPossiblePermutations).length} possible permutations (found ${foundDesired}/${desiredPatterns.length} desired)`);

            possiblePermutations = nextPossiblePermutations;
        }

        this.dump(`  - impossible patterns: ${desiredPatterns.length}`);


        return solution;
    }


    private getPartialsSet(desiredPatterns: string[]): Set<string> {
        // calculate partial patterns for fast ( O(1) )
        return new Set(
            desiredPatterns.map(desired => {
                // split up the desired pattern into its partials
                const partials: string[] = [];
                for (let i = 1; i <= desired.length; i++) {
                    partials.push(desired.substring(0, i));
                }
                return partials;
            }).flat()
        );
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day19_1());