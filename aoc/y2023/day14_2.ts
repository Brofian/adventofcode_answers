import AbstractRiddle from '../../src/JS/AbstractRiddle';

type Vector = {
    x: number,
    y: number,
};

enum Direction {
    NORTH,
    EAST,
    WEST,
    SOUTH,
}

class Y2023_Day14_2 extends AbstractRiddle {

    riddle: string = "What is the total load of the rolling stones after spinning a million times?";

    protected map: boolean[][] = [];
    protected oRocks: Vector[] = [];

    protected cache: {[key: string]: number} = {};

    run(): number {
        this.map = this.readInput().map((line, y) => {
            return line.split('').map((char, x) => {
                if (char === 'O') this.oRocks.push({x: x, y: y});
                return char === '#';
            })
        });


        let required = 1000000000;
        for (let cycle = 0; cycle < required; cycle++) {
            this.tilt(Direction.NORTH);
            this.tilt(Direction.WEST);
            this.tilt(Direction.SOUTH);
            this.tilt(Direction.EAST);
            // this.printBoard();

            const key = this.rocksToString();
            if (key in this.cache) {
                const cycleDuration = cycle - this.cache[key];
                const remaining = (required - cycle) % cycleDuration;
                required = cycle + remaining;
            }
            else {
                this.cache[key] = cycle;
            }
        }



        // calculate load on northern support beam
        let load = 0;
        for (const oRock of this.oRocks) {
            // calculate its load
            load += this.map.length - oRock.y;
        }

        return load;
    }

    protected rocksToString(): string {
        let key: string = "";
        for (const oRock of this.oRocks) {
            key += oRock.x + '-' + oRock.y + '_';
        }
        return key;
    }


    protected printBoard(): void {
        for (let y = 0; y < this.map.length; y++) {
            let row = "";
            for (let x = 0; x < this.map[0].length; x++) {
                if (this.map[y][x]) row += '#';
                else if (this.oRocks.some(r => r.x === x && r.y === y)) row += 'O';
                else row += '.';
            }
            console.log(row);
        }
        console.log();
    }

    protected tilt(direction: Direction): void {
        this.sortRollingRocks(direction);

        const vectorAdd = (a: Vector, b: Vector): Vector => {
            return {x: (a.x+b.x), y: (a.y+b.y)};
        };

        // check if the rock would collide with a static rock
        const staticRockCheck = (r: Vector) => {
            return (
                r.y >= 0 &&
                r.x >= 0 &&
                r.y < this.map.length &&
                r.x < this.map[0].length &&
                !this.map[r.y][r.x]
            );
        }

        // check if the rock would collide with another rolling rock
        const oRockCheck = (r: Vector) => !this.oRocks.some(b => {
            return b.x === r.x
                && b.y === r.y
        });


        const staticDirectionalVector = this.getDirectionalVector(direction);

        for (const oRock of this.oRocks) {
            let movedPosition = vectorAdd(oRock, staticDirectionalVector);

            // roll, while there is space
            while (staticRockCheck(movedPosition) && oRockCheck(movedPosition)) {
                oRock.x = movedPosition.x;
                oRock.y = movedPosition.y;
                movedPosition = vectorAdd(oRock, staticDirectionalVector);
            }
        }

    }

    protected sortRollingRocks(direction: Direction) {
        switch (direction) {
            case Direction.NORTH:
                this.oRocks.sort((a, b) => a.y < b.y ? -1 : 1);
                break;
            case Direction.SOUTH:
                this.oRocks.sort((a, b) => a.y > b.y ? -1 : 1);
                break;
            case Direction.EAST:
                this.oRocks.sort((a, b) => a.x > b.x ? -1 : 1);
                break;
            case Direction.WEST:
                this.oRocks.sort((a, b) => a.x < b.x ? -1 : 1);
                break;
        }
    }

    protected getDirectionalVector(direction: Direction): Vector {
        switch (direction) {
            case Direction.NORTH:
                return {x:  0, y: -1};
            case Direction.EAST:
                return {x:  1, y:  0};
            case Direction.SOUTH:
                return {x:  0, y:  1};
            case Direction.WEST:
                return {x: -1, y:  0};
        }
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2023_Day14_2());