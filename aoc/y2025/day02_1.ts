import AbstractRiddle from '../../src/JS/AbstractRiddle';

class Y2025_Day02_1 extends AbstractRiddle {

    riddle: string = "What do you get if you add up all of the invalid IDs?";

    run(input: string[]): number {

        // 1. Parse input
        const ranges = input[0].split(",").map(
            s => s.split('-',2));

        let sum = 0;

        for (const range of ranges) {
            const [fromS, toS] = range;
            const from = parseInt(fromS);
            const to = parseInt(toS);

            const minLength = fromS.length;
            const maxLength = toS.length;

            // check for all repeated numbers, if they lie in the range
            // the pattern of these numbers is: if split in the middle, both halves look the same
            for(let strLen = minLength; strLen <= maxLength; strLen++) {
                if (strLen % 2 === 1) continue; // the numbers have to have even length

                this.generateNumberStrings("", strLen/2, (str) => {
                    const num = parseInt(str + str);
                    if (num >= from && num <= to) {
                        sum += num;
                    }
                });
            }
        }

        return sum;
    }

    generateNumberStrings(current: string, targetLength: number, callback: {(s: string): void}): void {
        if (current.length >= targetLength) {
            callback(current);
            return;
        }

        // we cant have leading zeros
        const startValue = current === '' ? 1 : 0;
        for (let i = startValue; i <= 9; i++) {
            this.generateNumberStrings(current + i, targetLength, callback);
        }
    }
}

// noinspection JSUnusedGlobalSymbols
export default (new Y2025_Day02_1());