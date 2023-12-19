import AbstractRiddle from '../../src/JS/AbstractRiddle';

type Vector = {
    x: number,
    y: number,
};

class Y2023_Day14_1 extends AbstractRiddle {

    riddle: string = "What is the total load of the rolling stones after tilting north once?";

    protected oRocks: Vector[] = [];

    run(): number {
        const map: boolean[][] = this.readInput().map((line, y) => {
            return line.split('').map((char, x) => {
                if (char === 'O') this.oRocks.push({x: x, y: y});
                return char === '#';
            })
        });


        // tilt north
        let load = 0;
        for (const oRock of this.oRocks) {

            // check if the rock would collide with a static rock
            const staticRockCheck = (r: Vector) => r.y-1 >= 0 && !map[r.y-1][r.x];
            // check if the rock would collide with another rolling rock
            const oRockCheck = (r: Vector) => !this.oRocks.some(b => {
                return b !== r
                    && b.x === r.x
                    && b.y === (r.y-1)
            });


            // roll north, while there is space
            while (staticRockCheck(oRock) && oRockCheck(oRock)) {
                oRock.y--;
            }


            // calculate its load
            load += map.length - oRock.y;
        }

        return load;
    }


}

// noinspection JSUnusedGlobalSymbols
export default (new Y2023_Day14_1());