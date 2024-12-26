import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector from "../../src/JS/Vector";

const NORTH = "^";
const SOUTH = "v";
const EAST = ">";
const WEST = "<";
const ACCEPT = "A";
const EMPTY = " ";

type KeyPad = string[][];

class Y2024_Day21_1 extends AbstractRiddle {

    riddle: string = "What is the sum of the complexities of the five codes on your list?";

    directionalKeyPad: KeyPad = [
        [EMPTY, NORTH, ACCEPT],
        [WEST, SOUTH, EAST],
    ];

    numericalKeyPad: KeyPad = [
        ["7", "8", "9"],
        ["4", "5", "6"],
        ["1", "2", "3"],
        [EMPTY, "0", ACCEPT],
    ];

    cache: {[key: string]: number} = {};
    maxRecursionDepth: number = 2;

    run(input: string[]): string | number | bigint {

        // robot #1: numerical (input)
        // robot #2 - #26: directional
        // player: directional

        let sumOfComplexities = 0;

        for (const code of input) {
            this.dump(`> Starting code ${code}`);

            // robot #1 inputs:
            let requiredInputs = code;

            this.maxRecursionDepth = 25 + 1; // 25 robots + 1 player
            const totalInputLength = this.calcButtonPressesForSegment(requiredInputs, this.numericalKeyPad, 0);

            const complexity = totalInputLength * parseInt(code.split('').slice(0, -1).join(''));
            sumOfComplexities += complexity;

            // this.dump(requiredInputs.join(''));
            this.dump(`> Complexity of ${code} is ${totalInputLength} * ${parseInt(code.split('').slice(0, -1).join(''))} = ${complexity}`);
        }


        return sumOfComplexities;
    }

    private calcButtonPressesForSegment(code: string, keyPad: KeyPad, depth: number): number {
        //const p = "   ".repeat(depth);
        //this.dump(p+`> Checking ${code} in depth ${depth}`);

        if (depth >= this.maxRecursionDepth) {
            // this is the result we are searching for
            return code.length;
        }


        // lookup cached values

        const cacheKey = `${code}|${depth}`;
        if (this.cache[cacheKey]) {
            return this.cache[cacheKey];
        }

        let totalLength = 0;
        let armPosition = this.getCoordsOfCharOnKeyPad(ACCEPT, keyPad);
        for (const segment of code.split('')) {
            const to = this.getCoordsOfCharOnKeyPad(segment, keyPad);
            const diff = to.clone().sub(armPosition);
            const paths: string[] = this.vectorToPossibleDirections(diff, armPosition, keyPad === this.numericalKeyPad);

            armPosition = to;

            const minPath = Math.min(
                ...paths.map(path => this.calcButtonPressesForSegment(path + ACCEPT, this.directionalKeyPad, depth+1))
            );

            totalLength += minPath;
        }

        // cache button presses for future uses
        this.cache[cacheKey] = totalLength;

        return totalLength;
    }

    private vectorToPossibleDirections(v: Vector, from: Vector, isNumerical: boolean = false): string[] {
        const xChar = v.x > 0 ? EAST : WEST;
        const yChar = v.y > 0 ? SOUTH : NORTH;

        const xChars = xChar.repeat(Math.abs(v.x));
        const yChars = yChar.repeat(Math.abs(v.y));

        // prefer moving in a straight line
        if (v.x === 0) {
            return [yChars];
        }
        if (v.y === 0) {
            return [xChars];
        }

        if (isNumerical) {
            // special rules for numerical keypad

            if (from.x + v.x <= 0 && from.y === 3) { // when moving to the left side and starting at the bottom
                return [yChars + xChars]; // move vertical first to avoid EMPTY cell
            }

            if (from.y + v.y >= 3 && from.x === 0) { // when moving to the bottom and we are at the left side
                return [xChars + yChars]; // move horizontal first to avoid EMPTY cell
            }
        }
        else {
            // special rules for directional keypad

            if (from.equalsRaw(0,1)) { // if player is starting from WEST
                return [xChars + yChars]; // move horizontal first to avoid EMPTY cell
            }

            if (from.x + v.x <= 0 && from.y === 0) { // when moving to the left side and we are at the top
                return [yChars + xChars]; // move vertical first to avoid EMPTY cell
            }

        }

        return [yChars + xChars, xChars + yChars];
    }



    private getCoordsOfCharOnKeyPad(char: string, keyPad: KeyPad): Vector {
        for (let y = 0; y < keyPad.length; y++) {
            for (let x = 0; x < keyPad[y].length; x++) {
                if (keyPad[y][x] === char) {
                    return Vector.create(x, y);
                }
            }
        }
        this.assert(false, "No unknown chars on keypad");
        return Vector.create(0, 0);
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day21_1());