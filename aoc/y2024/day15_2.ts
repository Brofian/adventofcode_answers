import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector from "../../src/JS/Geometry/Vector";


const BOX = 'O';
const BOX_LEFT = '[';
const BOX_RIGHT = ']';
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

class Y2024_Day15_2 extends AbstractRiddle {

    riddle: string = "What is the sum of all boxes' final GPS coordinates?";

    run(input: string[]): number {

        const [
            robotPosition,
            map,
            directions
        ] = this.interpretInput(input);

        const mapBounds: [Vector, Vector] = [
            Vector.create(0,0), Vector.create(map[0].length-1, map.length-1)
        ];


        // let step = 0;

        for (const direction of directions) {
            /*
            console.log(` > Step ${step++} in direction ${direction}: `);
            console.log(map.map((line,y) => line.map((c,x) => {
                if (y === robotPosition.y && x === robotPosition.x) return ROBOT;
                else return c;
            }).join('')).join('\n') + '\n');
            */

            const directionVector = directionMap[direction];

            let canMove = true;
            const boxPartsToShift: Vector[] = [];

            const positionsToCheck: Vector[] = [
                robotPosition.clone().add(directionVector)
            ];

            while (positionsToCheck.length) {
                const positionToCheck = positionsToCheck.shift();
                if (!positionToCheck.in(...mapBounds)) {
                    continue;
                }

                const checkedField = map[positionToCheck.y][positionToCheck.x];

                if (checkedField === WALL) {
                    canMove = false;
                    break;
                }

                if (checkedField === EMPTY) {
                    continue;
                }

                let boxHalf1: Vector = positionToCheck.clone();
                let boxHalf2: Vector = positionToCheck.clone().addRaw(checkedField === BOX_LEFT ? 1 : -1,0);

                if (boxPartsToShift.find(box => box.x === boxHalf1.x && box.y === boxHalf1.y)) {
                    continue;
                }

                boxPartsToShift.push(boxHalf1, boxHalf2);

                switch (direction) {
                    case '<':
                        const left = boxHalf1.x < boxHalf2.x ? boxHalf1 : boxHalf2;
                        positionsToCheck.push(left.clone().add(directionVector));
                        break;
                    case '>':
                        const right = boxHalf1.x > boxHalf2.x ? boxHalf1 : boxHalf2;
                        positionsToCheck.push(right.clone().add(directionVector));
                        break;
                    case '^':
                    case 'v':
                        positionsToCheck.push(boxHalf1.clone().add(directionVector));
                        positionsToCheck.push(boxHalf2.clone().add(directionVector));
                        break;
                }
            }

            if (!canMove) {
                continue;
            }

            for (const boxToShift of boxPartsToShift.reverse()) { // handle far away box tiles first
                const newPosition = boxToShift.clone().add(directionVector);
                //console.log(` >> shift ${map[boxToShift.y][boxToShift.x]} onto ${map[newPosition.y][newPosition.x]} from ${boxToShift} to ${newPosition}`);
                map[newPosition.y][newPosition.x] = map[boxToShift.y][boxToShift.x];
                map[boxToShift.y][boxToShift.x] = EMPTY;
            }

            robotPosition.add(directionVector);
            map[robotPosition.y][robotPosition.x] = EMPTY;
        }


        // evaluate points
        return map.reduce((carry, line, y) => {
            return carry + line.reduce((carry2, cell, x) => {
                if (cell !== BOX_LEFT) return carry2;
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
                switch (cell) {
                    case ROBOT:
                        robotPosition.set(x*2,y);
                        return EMPTY + EMPTY;
                    case BOX:
                        return BOX_LEFT + BOX_RIGHT;
                    default:
                        return cell + cell;
                }
            }).join('').split('')
        );

        const directions = directionInput.join('').split('') as direction[];

        return [robotPosition, map, directions];
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day15_2());