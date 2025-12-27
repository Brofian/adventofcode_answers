import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector from "../../src/JS/Geometry/Vector";

const NORTH = "^";
const SOUTH = "v";
const EAST = ">";
const WEST = "<";
const ACCEPT = "A";
const EMPTY = " ";

type DirectionKey = '^' | 'v' | '<' | '>';
const directions: { [key in DirectionKey]: Vector } = {
    "^": Vector.create(0, -1),
    "v": Vector.create(0, 1),
    "<": Vector.create(-1, 0),
    ">": Vector.create(1, 0),
}

type KeyPad = string[][];
type Path = { from: string, to: string, directions: string[] };

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

    numericalPaths: Path[];
    directionalPaths: Path[];


    run(input: string[]): string | number | bigint {
        this.numericalPaths = this.preComputeBestPaths(this.numericalKeyPad);
        this.directionalPaths = this.preComputeBestPaths(this.directionalKeyPad);


        const codesToInput = input.map(line => line.split(''));

        // robot #1: numerical
        // robot #2: directional
        // robot #3: directional
        // player: directional

        let sumOfComplexities = 0;

        for (const code of codesToInput) {

            // robot #1 inputs:
            let requiredInputs = code;

            // robot #2 inputs:
            let armPosition = ACCEPT; // either from initial situation or previous code
            requiredInputs = requiredInputs.map(inp => {
                const path = this.numericalPaths.find(p => p.from === armPosition && p.to === inp);
                armPosition = inp;
                this.assert(path !== undefined);
                return [...path.directions, ACCEPT];
            }).flat();

            // robot #3 inputs:
            armPosition = ACCEPT; // either from initial situation or previous code
            requiredInputs = requiredInputs.map(inp => {
                const path = this.directionalPaths.find(p => p.from === armPosition && p.to === inp);
                armPosition = inp;
                this.assert(path !== undefined);
                return [...path.directions, ACCEPT];
            }).flat();


            // player inputs:
            armPosition = ACCEPT; // either from initial situation or previous code
            requiredInputs = requiredInputs.map(inp => {
                const path = this.directionalPaths.find(p => p.from === armPosition && p.to === inp);
                armPosition = inp;
                this.assert(path !== undefined);
                return [...path.directions, ACCEPT];
            }).flat();

            // Example 1: 029A
            // aoc player: <vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A
            // aoc robot3:   v <<   A >>  ^ A   <   A > A  v  A   <  ^ AA > A   < v  AAA >  ^ A
            // aoc robot2:          <       A       ^   A     >        ^^   A        vvv      A
            // aoc robot1:                  0           2                   9                 A
            // me  player: <vA<AA>>^AvAA<^A>A<v<A>>^AvA^Av<<A>>^AAv<A>A^A<A>Av<A<A>>^AAA<Av>A^A
            // me  robot3:   v <<   A >>  ^ A   <   A > A   <   AA  v > A ^ A  v <   AAA ^  > A
            // me  robot2:          <       A       ^   A       ^^      >   A        vvv      A
            // me  robot1:                  0           2                   9                 A


            // Example 5: 379A
            // aoc player: <v<A>>^AvA^A<vA<AA>>^AAvA<^A>AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A
            // aoc robot3:    <   A > A  v <<   AA >  ^ AA > A  v  AA ^ A   < v  AAA >  ^ A
            // aoc robot2:        ^   A         <<      ^^   A     >>   A        vvv      A
            // aoc robot1:            3                      7          9                 A
            // me  player: v<<A>>^AvA^Av<<A>>^AAv<A<A>>^AAvAA^<A>Av<A^>AA<A>Av<A<A>>^AAA<Av>A^A
            // me  robot3:    <   A > A   <   AA  v <   AA >>  ^ A  v  AA ^ A  v <   AAA ^  > A
            // me  robot2:        ^   A       ^^        <<       A     >>   A        vvv      A
            // me  robot1:            3                          7          9                 A


            const complexity = requiredInputs.length * parseInt(code.slice(0, -1).join(''));
            sumOfComplexities += complexity;

            // this.dump(requiredInputs.join(''));
            // this.dump(`> Complexity of ${code.join('')} is ${requiredInputs.length} * ${parseInt(code.slice(0, -1).join(''))} = ${complexity}`);
        }

        return sumOfComplexities;
    }


    /**
     * Calculate every best path from any key on the keyPad to any other key
     *
     * @param keyPad
     * @private
     */
    private preComputeBestPaths(keyPad: KeyPad): Path[] {
        const keys = keyPad.flat().filter(key => key !== EMPTY);
        const paths: Path[] = [];
        for (const start of keys) {
            for (const end of keys) {
                paths.push({
                    from: start,
                    to: end,
                    directions: this.findShortestPath(
                        keyPad,
                        this.getCoordsOfCharOnKeyPad(start, keyPad),
                        this.getCoordsOfCharOnKeyPad(end, keyPad),
                    )
                });
            }
        }
        return paths;
    }

    /**
     * Determine the cheapest path to get from start to end on the given keypad
     *
     * @param keyPad
     * @param start
     * @param end
     * @private
     */
    private findShortestPath(keyPad: KeyPad, start: Vector, end: Vector): DirectionKey[] {
        if (start.equals(end)) {
            return [];
        }

        const bounds: [Vector,Vector] = [Vector.create(0,0), Vector.create(keyPad[0].length-1, keyPad.length-1)];
        const queue: {
            pos: Vector,
            path: DirectionKey[],
            cost: number;
        }[] = [{pos: start, path: [], cost: 0}];

        let bestCost = Infinity;
        let bestPaths: DirectionKey[][] = [];

        while (queue.length) {
            const state = queue.shift();

            // check if we already exceeded the best found path
            if (state.cost > bestCost) {
                continue; // do not even bother anymore
            }

            // check if we reached the target
            if (state.pos.equals(end)) {
                if (state.cost < bestCost) {
                    bestCost = state.cost;
                    bestPaths = [state.path];
                }
                else if (state.cost === bestCost) {
                    bestPaths.push(state.path);
                }
                continue;
            }

            // add all new possible next steps to the queue
            for (const dirKey in directions) {
                const neighbour = state.pos.clone().add(directions[dirKey as DirectionKey]);

                if (neighbour.in(...bounds) && keyPad[neighbour.y][neighbour.x] !== EMPTY) {
                    const isSameAsLastDirection = state.path.length && dirKey === state.path[state.path.length-1];

                    queue.push({
                        pos: neighbour,
                        path: [...state.path, dirKey as DirectionKey],
                        cost: state.cost + (isSameAsLastDirection ? 1 : 1000) // make turning way more expensive
                    });
                }
            }
        }


        this.assert(bestPaths.length > 0, 'No impossible move');


        // select best solution, based on some criteria
        bestPaths.sort((pathA, pathB) => {
            // Criteria 1: continuing into the last direction, should not step outside the boundaries (possible reuse)
            const lastDirA = pathA[pathA.length-1];
            const lastDirB = pathA[pathB.length-1];
            if (lastDirA !== lastDirB) {
                const nextTileA = end.clone().add(directions[lastDirA]);
                const nextTileB = end.clone().add(directions[lastDirB]);
                const nextAOutside = !nextTileA.in(...bounds) || keyPad[nextTileA.y][nextTileA.x] === EMPTY;
                const nextBOutside = !nextTileB.in(...bounds) || keyPad[nextTileB.y][nextTileB.x] === EMPTY;
                if (nextAOutside !== nextBOutside) {
                    return nextBOutside ? -1 : 1; // if B would step out, prefer A. And vice versa
                }
            }

            // Criteria 2: attempt to shift west towards the beginning
            if (pathA.includes(WEST)) {
                return pathA.indexOf(WEST) < pathB.indexOf(WEST) ? -1 : 1;
            }


            return 0;
        });

        return bestPaths[0];
    }

    private getCoordsOfCharOnKeyPad(char: string, keyPad: KeyPad): Vector {
        for (let y = 0; y < keyPad.length; y++) {
            for (let x = 0; x < keyPad[y].length; x++) {
                if (keyPad[y][x] === char) {
                    return Vector.create(x,y);
                }
            }
        }
        this.assert(false, "No unknown chars on keypad");
        return Vector.create(0,0);
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day21_1());