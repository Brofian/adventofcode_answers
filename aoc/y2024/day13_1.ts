import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector from "../../src/JS/Geometry/Vector";


type Machine = {
    a: Vector;
    b: Vector;
    target: Vector;
}


class Y2024_Day13_1 extends AbstractRiddle {

    riddle: string = "What is the fewest tokens you would have to spend to win all possible prizes?";

    run(input: string[]): number {

        this.assert(input.length % 4 === 3, 'The input consists of four lines per machine config, except the last with 3 lines');

        // parse machine configurations
        const machines: Machine[] = [];
        for (let i = 0; i < input.length; i += 4) {
            const aMatch = input[i].match(/Button A: X\+(\d+), Y\+(\d+)/)
            const bMatch = input[i+1].match(/Button B: X\+(\d+), Y\+(\d+)/)
            const targetMatch = input[i+2].match(/Prize: X=(\d+), Y=(\d+)/)

            this.assert(aMatch !== null, 'a matching');
            this.assert(bMatch !== null, 'b matching');
            this.assert(targetMatch !== null, 'target matching');

            this.assert(aMatch[1] !== '0' && aMatch[2] !== '0', 'no unused directions on a');
            this.assert(bMatch[1] !== '0' && bMatch[2] !== '0', 'no unused directions on b');

            machines.push({
               a: Vector.create(parseInt(aMatch[1]), parseInt(aMatch[2])),
               b: Vector.create(parseInt(bMatch[1]), parseInt(bMatch[2])),
               target: Vector.create(parseInt(targetMatch[1]), parseInt(targetMatch[2])),
            });
        }


        const aCost = 3;
        const bCost = 1;

        // t.x = a * a.x + b * b.x
        // a * a.x = b * b.x - t.x
        // a = (b * b.x - t.x) / a.x

        let fewestNumOfTokensToWinAllPossible = 0;


        for (const machine of machines) {
            const a = machine.a;
            const b = machine.b;
            const target = machine.target;

            // solve equation towards a
            const possibleCombinations: [number,number][] = [];
            for (let bPresses = 1; bPresses < 100; bPresses++) {
                // check how much coordinates a would have to cover (negative, so a can add up to it!)
                const remainderAfterB = bPresses * b.x - target.x;
                if (remainderAfterB > 0) {
                    break; // stop if the b presses alone would exceed the target
                }
                const aPresses = -remainderAfterB / a.x;
                if (Number.isInteger(aPresses) && aPresses <= 100 && target.y === (aPresses * a.y + bPresses * b.y)) {
                    // only a full number <= 100 can be the press count of a.
                    // The numbers also have to work for the y direction.
                    possibleCombinations.push([aPresses, bPresses])
                }
            }

            // find the cheapest combination
            const cheapest = possibleCombinations.reduce((prev: [number,number,number], current) => {
                const currentCost = current[0] * aCost + current[1] * bCost;
                return (currentCost > prev[2]) ? prev : [...current, currentCost]
            }, [0,0,Infinity]);

            if (cheapest[2] !== Infinity) {
                // there is a way to win
                fewestNumOfTokensToWinAllPossible += cheapest[2];
            }
            else {
                // there is no way to win
            }
        }

        return fewestNumOfTokensToWinAllPossible;
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day13_1());