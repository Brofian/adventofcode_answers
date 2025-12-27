import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector from '../../src/JS/Geometry/Vector';



class Y2023_Day21_1 extends AbstractRiddle {

    riddle: string = "How many garden plots can be reached in exactly 64 steps?";

    protected map: boolean[][];

    run(): number {
        const startingPosition: Vector = Vector.create(0,0);

        this.map = this.readInput().map((line,y) => line.split('').map((char,x) => {
            if(char === 'S') {
                startingPosition.set(x,y);
                return true;
            }
            return char === '.';
        }));


        const mapWidth = this.map[0].length;
        const mapHeight = this.map.length;

        let possibleElfPositions: boolean[][] = this.create2DArray(mapWidth, mapHeight, (x,y) => false);
        possibleElfPositions[startingPosition.y][startingPosition.x] = true;
        let possibleElfPositionsCount = 1;


        const requiredSteps = 64;
        for (let i = 0; i < requiredSteps; i++) {

            let nextPositions: boolean[][] = this.create2DArray(mapWidth, mapHeight, (x,y) => false);


            for (let y = 0; y < mapHeight; y++) {
                for (let x = 0; x < mapWidth; x++) {
                    if (possibleElfPositions[y][x]) {

                        if (y > 0 && this.map[y-1][x]) {
                            nextPositions[y-1][x] = true;
                        }

                        if (x > 0 && this.map[y][x-1]) {
                            nextPositions[y][x-1] = true;
                        }

                        if (y < mapHeight-1 && this.map[y+1][x]) {
                            nextPositions[y+1][x] = true;
                        }

                        if (x < mapWidth-1 && this.map[y][x+1]) {
                            nextPositions[y][x+1] = true;
                        }

                    }
                }
            }

            possibleElfPositions = nextPositions;
        }


        return possibleElfPositions.reduce((carry,line) =>
            carry + line.reduce((carry, tile) => carry+(tile?1:0), 0), 0);
    }
}

// noinspection JSUnusedGlobalSymbols
export default (new Y2023_Day21_1());