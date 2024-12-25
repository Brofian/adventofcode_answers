import AbstractRiddle from '../../src/JS/AbstractRiddle';

class Y2024_Day25_1 extends AbstractRiddle {

    riddle: string = "How many unique lock/key pairs fit together without overlapping in any column?";

    run(input: string[]): string | number | bigint {

        const {keys, locks, totalHeight} = this.readKeysAndLocks(input);

        let numNonOverlappingPairs = 0;

        for (const key of keys) {

            for (const lock of locks) {

                const noOverlap = key.every((keyHeight, index) => {
                    return (keyHeight + lock[index]) <= totalHeight
                });

                if (noOverlap) {
                    numNonOverlappingPairs++;
                }
            }
        }

        return numNonOverlappingPairs;
    }

    private readKeysAndLocks(input: string[]): {keys: number[][], locks: number[][], totalHeight: number} {
        const keys: number[][] = [];
        const locks: number[][] = [];

        const patternHeight = input.findIndex(line => line === '');
        for (let i = 0; i < input.length; i += patternHeight+1) {
            const pattern = input.slice(i, i+patternHeight);

            const tPattern: string[][] = this.transpose2DArray(pattern.map(line => line.split('')));
            const heights: number[] = tPattern.map(col => col.filter(el => el === '#').length - 1);

            const isKey = pattern[0][0] === '.';
            if (isKey) {
                keys.push(heights);
            }
            else {
                locks.push(heights);
            }
        }

        return {keys, locks, totalHeight: patternHeight - 2};
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day25_1());