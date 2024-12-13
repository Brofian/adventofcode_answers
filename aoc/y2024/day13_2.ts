import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector from "../../src/JS/Vector";


type Machine = {
    a: Vector;
    b: Vector;
    target: Vector;
}


class Y2024_Day13_2 extends AbstractRiddle {

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
               target: Vector.create(
                   parseInt(targetMatch[1]) + 10000000000000,
                   parseInt(targetMatch[2]) + 10000000000000
               ),
            });
        }

        const aCost = 3;
        const bCost = 1;

        // t.x = a * a.x + b * b.x
        // 0 = a * a.x + b * b.x - t.x
        // t.y = a * a.y + b * b.y
        // 0 = a * a.y + b * b.y - t.y

        // a * a.x + b * b.x - t.x = a * a.y + b * b.y - t.y
        // a * a.x - a * a.y = b * b.y - b * b.x - t.y + t.x
        // a * (a.x - a.y) = b * b.y - b * b.x - t.y + t.x

        // solve for a
        // a = (b * (b.y - b.x) - t.y + t.x) / (a.x - a.y)

        // substitute a
        // 0 = a * a.y + b * b.y - t.y
        // 0 = ((b * (b.y - b.x) - t.y + t.x) / (a.x - a.y)) * a.y + b * b.y - t.y
        // 0 = ((b * (67 - 22) - 5400 + 8400) / (94 - 34)) * 34 + b * 67 - 5400

        // Solve for b
        // 0 = (b * (b.y - b.x) * a.y - t.y * a.y + t.x * a.y) / (a.x - a.y) + b * b.y - t.y
        // 0 = (b * (b.y - b.x) * a.y) / (a.x - a.y) + (a.y * (-t.y + t.x)) / (a.x - a.y) + b * b.y - t.y
        // -(b * (b.y - b.x) * a.y) / (a.x - a.y) = (a.y * (-t.y + t.x)) / (a.x - a.y) + b * b.y - t.y
        // -(b * (b.y - b.x) * a.y) / (a.x - a.y) - b * b.y = (a.y * (-t.y + t.x)) / (a.x - a.y) - t.y
        // b * ((-(b.y - b.x) * a.y) / (a.x - a.y) - b.y) = (a.y * (-t.y + t.x)) / (a.x - a.y) - t.y
        // b = ((a.y * (-t.y + t.x)) / (a.x - a.y) - t.y) / ((-(b.y - b.x) * a.y) / (a.x - a.y) - b.y)

        let fewestNumOfTokensToWinAllPossible = 0;
        const allowedMarginOfError = 0.0001;

        for (const machine of machines) {
            const a = machine.a;
            const b = machine.b;
            const t = machine.target;


            // b = ((a.y * (-t.y + t.x)) / (a.x - a.y) - t.y) / ((-(b.y - b.x) * a.y) / (a.x - a.y) - b.y)
            const bPresses = (
                ((a.y * (-t.y + t.x)) / (a.x - a.y) - t.y) / ((-(b.y - b.x) * a.y) / (a.x - a.y) - b.y)
            );

            // fix rounding errors
            const roundedBPresses = Math.round(bPresses);
            if (bPresses < 0 || Math.abs(bPresses - roundedBPresses) > allowedMarginOfError) {
                console.log(` > Invalid bPresses: ${bPresses}`);
                continue;
            }

            // a = (b * (b.y - b.x) - t.y + t.x) / (a.x - a.y)
            const aPresses = (bPresses * (b.y - b.x) - t.y + t.x) / (a.x - a.y);

            // fix rounding errors
            const roundedAPresses = Math.round(aPresses);
            if (aPresses < 0 || Math.abs(aPresses - roundedAPresses) > allowedMarginOfError) {
                console.log(` > Invalid aPresses: ${aPresses}`);
                continue;
            }


            this.assert(roundedAPresses * a.x + roundedBPresses * b.x === t.x, 'Solution works for x values');
            this.assert(roundedAPresses * a.y + roundedBPresses * b.y === t.y, 'Solution works for y values');

            const cost = roundedAPresses * aCost + roundedBPresses * bCost;
            fewestNumOfTokensToWinAllPossible += cost;
        }

        return fewestNumOfTokensToWinAllPossible;
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day13_2());