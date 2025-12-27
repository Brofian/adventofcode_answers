import AbstractRiddle from '../../src/JS/AbstractRiddle';

type Machine = {
    lightDiagram: boolean[];
    wiringSchematics: number[][];
    joltageRequirements: number[];
};

class Y2025_Day10_2 extends AbstractRiddle {

    riddle: string = "What is the fewest button presses required to correctly configure the joltage level counters on all of the machines?";

    run(input: string[]): number {

        const machines: Machine[] = input.map(this.parseInputLine.bind(this));

        let totalButtonPresses = 0;

        for (const machine of machines) {

            const buttonInts: bigint[] = machine.wiringSchematics.map(ws => {
                return ws
                    .map(n => 1n << BigInt(n)) // turn each number to a bit in an integer
                    .reduce((acc, n) => acc | n); // add all those bits
            });

            const buttonPresses = this.findRequiredNumberOfPresses(
                machine.joltageRequirements,
                buttonInts,
                machine.wiringSchematics
            );

            totalButtonPresses += buttonPresses;
        }

        return totalButtonPresses;
    }

    findRequiredNumberOfPresses(jr: number[], buttonInts: bigint[], buttons: number[][]): number {
        if (jr.every(j => j === 0)) {
            return 0;
        }


        // if some are odd, we have to find a button combination, that creates this oddity
        const oddityBigInt = this.numberOdditiesToBigint(jr);
        const togglingPresses = this.findPressesForJoltageOddities(
            buttonInts,0, 0n, oddityBigInt
        );

        // test out all the oddity combinations above
        let bestSolution = Infinity;
        for (const togglingPressCombi of togglingPresses) {
            // apply the button presses to the jr (making them even)
            const newJr = [...jr];
            let l = 0;
            for (const bIndex of this.bigintToButtonIndices(togglingPressCombi)) {
                l++;
                for (const counterIndex of buttons[bIndex]) {
                    newJr[counterIndex] -= 1;
                }
            }

            if (newJr.some(j => j < 0)) {
                continue; // if we overshot our targets, ignore this path
            }

            const halfJr = newJr.map(j => j / 2);
            const s = l + 2 * this.findRequiredNumberOfPresses(halfJr, buttonInts, buttons);

            if (s < bestSolution) {
                bestSolution = s;
            }
        }
        return bestSolution;
    }

    findPressesForJoltageOddities(bInts: bigint[], bIndex: number, presses: bigint, target: bigint): bigint[] {
        if (bIndex >= bInts.length) {
            // if we successfully turned the target to 0, we found our presses combination
            return (target === 0n) ? [presses] : [];
        }

        // press not and continue
        const s1 = this.findPressesForJoltageOddities(bInts, bIndex+1, presses, target);
        // press and continue
        const s2 = this.findPressesForJoltageOddities(bInts, bIndex+1,
            presses | (1n << BigInt(bIndex)), // mark the bit for a press
            target ^ bInts[bIndex]
        );

        return [...s1, ...s2];
    }

    numberOdditiesToBigint(nums: number[]): bigint {
        return nums
            .map((n,i) => ((n%2 === 1) ? 1n : 0n) << BigInt(i))
            .reduce((acc, n) => acc | n);
    }

    bigintToButtonIndices(b: bigint): number[] {
        const buttons: number[] = [];
        let i = 0;
        while (b > 0n) {
            if ((b & 1n) === 1n) {
                buttons.push(i);
            }
            i++;
            b /= 2n;
        }
        return buttons;
    }


    parseInputLine(line: string): Machine {
        const stringToInt = (d: string) => parseInt(d);

        const rgx = /^\[(.+)] (\(.+\)) \{(.*)}/;
        const match = rgx.exec(line);
        this.assert(match.length >= 4, "Line has to be a valid machine")
        const [_, ld, ws, jr] = match;
        return {
            lightDiagram: ld.split('').map(c => c === '#'),
            wiringSchematics: ws.split(' ').map(part => {
                const nums = part.substring(1, part.length - 1);
                return nums.split(',').map(stringToInt);
            }),
            joltageRequirements: jr.split(',').map(stringToInt)
        };
    }


}

// noinspection JSUnusedGlobalSymbols
export default (new Y2025_Day10_2());