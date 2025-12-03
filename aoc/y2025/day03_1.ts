import AbstractRiddle from '../../src/JS/AbstractRiddle';

class Y2025_Day03_1 extends AbstractRiddle {

    riddle: string = "what is the total output joltage?";

    run(input: string[]): number {

        const joltages: number[] = input.map(bank => {
            const batteries = bank.split('').map(x => parseInt(x));
            let firstLargest = 0;
            let firstIndex = 0;
            let secondLargest = 0;

            for (let i = 0; i < batteries.length - 1; i++) {
                const batterie = batteries[i];
                if (firstLargest < batterie) {
                    firstLargest = batterie;
                    firstIndex = i;
                }
            }

            for (let i = firstIndex+1; i < batteries.length; i++) {
                const batterie = batteries[i];
                secondLargest = Math.max(secondLargest, batterie);
            }

            return firstLargest * 10 + secondLargest;
        })

        return joltages.reduce((acc, curr) => acc + curr, 0);
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2025_Day03_1());