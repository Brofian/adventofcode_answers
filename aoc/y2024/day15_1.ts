import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector from "../../src/JS/Vector";

const BOX = 'O';
const WALL = '#';
const ROBOT = '@';
const EMPTY = '.';

type direction = 'v'|'^'|'<'|'>';
const directionMap: {[key in direction]: Vector} = {
    '^': Vector.create(0, -1),
    'v': Vector.create(0, 1),
    '<': Vector.create(-1, 0),
    '>': Vector.create(1, 0),
}

class Y2024_Day15_1 extends AbstractRiddle {

    riddle: string = "what is the sum of all boxes' GPS coordinates?";

    run(input: string[]): number {

        const [
            robotPosition,
            map,
            directions
        ] = this.interpretInput(input);

        const mapBounds: [Vector, Vector] = [
            Vector.create(0,0), Vector.create(map[0].length-1, map.length-1)
        ];

        for (const direction of directions) {

            // console.log(map.map(line => line.join('')).join('\n') + '\n');

            const directionVector = directionMap[direction];

            let canMove = true;
            let lastBoxToShift: Vector|undefined = undefined;

            const positionToCheck: Vector = robotPosition.clone().add(directionVector);

            while (positionToCheck.in(...mapBounds)) {
                const checkedField = map[positionToCheck.y][positionToCheck.x];

                if (checkedField === WALL) {
                    canMove = false;
                    break;
                }

                if (checkedField === EMPTY) {
                    break;
                }

                if (checkedField === BOX) {
                    lastBoxToShift = positionToCheck.clone();
                }

                positionToCheck.add(directionVector);
            }

            if (!canMove) {
                continue;
            }

            if (lastBoxToShift !== undefined) {
                const newBoxPos = lastBoxToShift.add(directionVector);
                map[newBoxPos.y][newBoxPos.x] = BOX;
            }
            robotPosition.add(directionVector);
            map[robotPosition.y][robotPosition.x] = EMPTY;
        }



        // evaluate points
        return map.reduce((carry, line, y) => {
            return carry + line.reduce((carry2, cell, x) => {
                if (cell !== BOX) return carry2;
                const gps = 100 * y + x;
                return carry2 + gps;
            }, 0);
        }, 0);
    }

    protected interpretInput(input: string[]): [
        Vector, // robot position
        string[][], // map
        direction[], // directions
    ] {
        const inputSplit = input.findIndex(line => line === '');
        const mapInput = input.slice(0, inputSplit);
        const directionInput = input.slice(inputSplit+1);


        const robotPosition: Vector = Vector.create(0,0);
        const map: string[][] = mapInput.map((line,y) =>
            line.split('').map((cell,x) => {
                if (cell === ROBOT) {
                    robotPosition.set(x,y);
                    return EMPTY;
                }
                return cell;
            })
        );

        const directions = directionInput.join('').split('') as direction[];

        return [robotPosition, map, directions];
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day15_1());