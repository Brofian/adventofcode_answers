import AbstractRiddle from '../../src/JS/AbstractRiddle';

class Y2025_Day03_2 extends AbstractRiddle {

    riddle: string = "what is the total output joltage?";

    run(input: string[]): number {

        const joltages: number[] = input.map(bank => {
            const batteries = bank.split('').map(x => parseInt(x));

            let total = 0;
            let startIndex = 0;

            for (let remainingDigits = 12; remainingDigits > 0; remainingDigits--) {
                // always select the largest digit that has enough following digits
                const canSearchUntil = batteries.length - remainingDigits;

                const [largest,foundAtIndex] = this.findNextLargest(batteries, startIndex, canSearchUntil);

                // only use the following to keep searching
                startIndex = foundAtIndex+1;

                // shift all digits in the decimal system by one position and add the new one
                total = (total * 10) + largest;
            }

            return total;
        })

        return joltages.reduce((acc, curr) => acc + curr, 0);
    }

    /**
     * Find the largest number in the array between two indices (both inclusive) and return the value and its index
     */
    findNextLargest(list: number[], startIndex: number, endIndex: number): [number, number] {
        let largest = 0;
        let foundAtIndex = 0;

        for (let i = startIndex; i <= endIndex; i++) {
            const value = list[i];

            if (largest < value) {
                largest = value;
                foundAtIndex = i;
            }
        }

        return [largest,foundAtIndex];
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2025_Day03_2());