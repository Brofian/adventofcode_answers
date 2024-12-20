import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector from "../../src/JS/Vector";

const directions: Vector[] = [
    Vector.create(-1, 0),
    Vector.create( 1, 0),
    Vector.create( 0,-1),
    Vector.create( 0, 1),
];


class Y2024_Day20_1 extends AbstractRiddle {

    riddle: string = "How many cheats would save you at least 100 picoseconds?";

    run(input: string[]): string | number | bigint {

        const [start, end, map] = this.readInputMap(input);

        // step 1: find the default path through the maze

        const path: Vector[] = [start];
        let reachedEnd = false;
        do {
            // find adjacent path,that is not the previous path

            for (const dir of directions) {
                const coords = path[0].clone().add(dir);

                if (map[coords.y][coords.x] === '.' && (path.length === 1 || !coords.equals(path[1]))) {
                    path.unshift(coords);
                    break;
                }
            }

            reachedEnd = path[0].equals(end);
        }
        while (!reachedEnd);

        // reverse the path to get the start tile at index 0 and the end tile at the last index
        path.reverse();


        const cheatCost = 2;
        const cheatSavingCondition = 100;

        let cheatsSaving100Picoseconds = 0;
        //

        for (let startIndex = 0; startIndex < path.length; startIndex++) {
            const startCoords = path[startIndex];

            // check which tiles can be cheated onto  in 2 picoseconds
            // this cheat should save at least 100 picoseconds, so the next 102 tiles cant be the solution
            for (let endIndex = startIndex+cheatSavingCondition+cheatCost; endIndex < path.length; endIndex++) {
                const endCoords = path[endIndex];

                const diff = startCoords.clone().sub(endCoords).abs();
                if ((diff.x + diff.y) === cheatCost) {
                    // the tiles can be reached by a cheat

                    // check if these tiles are not already connected
                    // -> we dont have to do this, because we start searching for the end at least 102 units in the future

                    // const sparedTime = endIndex - startIndex - 2;
                    // this.dump(`Found cheat saving ${sparedTime} picoseconds, when going from ${startCoords} to ${endCoords}`);
                    cheatsSaving100Picoseconds++;
                }
            }
        }

        return cheatsSaving100Picoseconds;
    }

    private readInputMap(input: string[]): [Vector, Vector, string[][]] {
        const start: Vector = Vector.create(0,0);
        const end: Vector = Vector.create(0,0);
        const map = input.map((line, y) => line.split('').map(
            (cell, x) => {
                if (cell === 'S') {
                    start.set(x,y);
                    return '.';
                }
                if (cell === 'E') {
                    end.set(x,y);
                    return '.';
                }
                return cell;
            }
        ));

        return [start, end, map];
    }
}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day20_1());