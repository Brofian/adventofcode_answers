import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector from '../../src/JS/Vector';


class Y2023_Day21_2 extends AbstractRiddle {

    riddle: string = "How many garden plots can be reached in exactly 64 steps?";

    protected map: boolean[][];
    protected mapSize: number = 0;
    protected startingPosition: Vector = Vector.create(0,0);

    run(input: string[]): number {

        this.map = input.map((line,y) => line.split('').map((char,x) => {
            if(char === 'S') {
                this.startingPosition.set(x,y);
                return true;
            }
            return char === '.';
        }));
        const numWalkableTiles: number = this.map.reduce((c1, row) => row.reduce(row => row ? 1 : 0, 0) + c1,0);

        const mapWidth = this.map[0].length;
        const mapHeight = this.map.length;

        const stepsToTake = 26501365;

        this.assert(mapWidth == mapHeight, 'quadratic tiles');
        this.mapSize = mapWidth;
        this.assert(this.mapSize % 2 === 1, 'odd width and height');
        this.assert(this.startingPosition.x == Math.floor(this.mapSize / 2), 'starting position in the middle of a tile');
        const halfWidth = Math.floor(this.mapSize / 2);
        this.assert(stepsToTake % this.mapSize === halfWidth, 'Steps to take being multiple of map width ')

        const fieldReach = Math.floor(stepsToTake / this.mapSize);

        const reachableTilesWhenEven = this.getReachableFieldsWithNSteps(this.mapSize * 2);
        const reachableTilesWhenOdd = this.getReachableFieldsWithNSteps(this.mapSize * 2 + 1);

        const edge = 0.125;
        const tileWithoutEdge = 1 - edge;
        const tileWithoutTwoEdges = 1 - 2*edge;

        let fullEvenFields, fullOddFields, partialOddFields, partialEvenFields;


        const widestFullRing = fieldReach % 2 ? 'even' : 'odd';
        if (widestFullRing === 'even') {
            fullEvenFields = fieldReach * fieldReach;
            fullOddFields = (fieldReach - 1) * (fieldReach - 1);
            partialOddFields =
                (fieldReach - 1) * 4 * tileWithoutEdge +
                4 * tileWithoutTwoEdges;
            partialEvenFields = fieldReach * 4 * edge;
        }
        else {
            fullEvenFields = (fieldReach - 1) * (fieldReach - 1);
            fullOddFields = fieldReach * fieldReach;
            partialEvenFields =
                (fieldReach - 1) * 4 * tileWithoutEdge +
                4 * tileWithoutTwoEdges;
            partialOddFields = fieldReach * 4 * edge;
        }

        // we still have a very small error margin
        console.log(fullOddFields, fullEvenFields, partialOddFields, partialOddFields);

        return (
            fullEvenFields * reachableTilesWhenEven +
            partialEvenFields * reachableTilesWhenEven +
            fullOddFields * reachableTilesWhenOdd +
            partialOddFields * reachableTilesWhenOdd
        );
    }

    getReachableFieldsWithNSteps(steps: number): number {
        let possibleElfPositions: boolean[][] = this.create2DArray(this.mapSize, this.mapSize,
            (x,y) => this.startingPosition.equalsRaw(x,y)
        );

        for (let i = 0; i < steps; i++) {

            possibleElfPositions = this.create2DArray(
                this.mapSize, this.mapSize, (x, y) => {
                    return this.map[y][x] && (
                        (y > 0 && possibleElfPositions[y-1][x]) ||
                        (x > 0 && possibleElfPositions[y][x-1]) ||
                        (y < this.mapSize-1 && possibleElfPositions[y+1][x]) ||
                        (x < this.mapSize-1 && possibleElfPositions[y][x+1])
                    );
                });
        }

        /*
        console.log(possibleElfPositions.map((r,y) =>
            r.map((c,x) => {
                    if (this.startingPosition.equalsRaw(x,y)) return 'S';
                    if (!this.map[x][y]) return '#';
                    if (c) return 'O';
                    return '.';
                }).join('')).join('\n'));
         */

        return possibleElfPositions.reduce(
            (c1,row) =>
                c1+row.reduce(
                    (c2,cell) =>
                        c2+ (cell ? 1 : 0), 0), 0);
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2023_Day21_2());