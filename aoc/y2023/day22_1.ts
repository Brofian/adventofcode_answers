import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector3D from "../../src/JS/Vector3D";


type Brick = [Vector3D, Vector3D];


class Y2023_Day22_1 extends AbstractRiddle {

    riddle: string = "how many bricks could be safely chosen as the one to get disintegrated?";

    grid: (Brick|undefined)[][][];
    bricks: Brick[];

    run(input: string[]): number {

        this.bricks = input.map(line => {
            const regex = /(\d+),(\d+),(\d+)~(\d+),(\d+),(\d+)/gm;
            let m = regex.exec(line);
            this.assert(m && m.length >= 7, 'input line is invalid: ' + line);

            const c = m.slice(1,7).map(v => parseInt(v));

            return [
                Vector3D.create(
                    Math.min(c[0], c[3]),
                    Math.min(c[1], c[4]),
                    Math.min(c[2], c[5]),
                ),
                Vector3D.create(
                    Math.max(c[0], c[3]),
                    Math.max(c[1], c[4]),
                    Math.max(c[2], c[5]),
                ),
            ];
        });

        this.bricks.sort((b1, b2) =>
            b1[0].z < b2[0].z ? -1 : 1
        );

        const extents = this.bricks.reduce((c,b) => {
            c.x = Math.max(c.x, b[1].x+1);
            c.y = Math.max(c.y, b[1].y+1);
            c.z = Math.max(c.z, b[1].z+2); // to skip a z check later on, add one additional layer
            return c;
        }, new Vector3D(0,0,0));

        this.grid = this.create3DArray(extents.x, extents.y, extents.z, (): Brick => undefined);


        this.assert(this.bricks.every(brick => brick[0].z > 0), 'All bricks starting in the air');

        for (const brick of this.bricks) {
            const [lower, upper] = brick;

            // place bricks from lowest to highest

            while (lower.z >= 0) {
                // check if we collide with something
                if (lower.z === 0 || this.checkIfBrickIsPlaced(brick)) {
                    this.placeBrick(brick);
                    break;
                }

                // if no collision, move the brick down
                lower.z--;
                upper.z--;
            }
        }

        const disposableBricks: Brick[] = [];

        // for every brick, check if a brick on top relies on it
        for (const brick of this.bricks) {
            const relyingBricks = this.getBricksOnTopOf(brick);
            if (relyingBricks.length === 0) {
                disposableBricks.push(brick);
            }
        }

        return disposableBricks.length;
    }

    private checkIfBrickIsPlaced(brick: Brick): boolean {
        this.assert(brick[0].z > 0);

        const z = brick[0].z - 1;
        for (let x = brick[0].x; x <= brick[1].x; x++) {
            for (let y = brick[0].y; y <= brick[1].y; y++) {
                // check if we have a block underneath
                if (this.grid[x][y][z] !== undefined) {
                    return true;
                }
            }
        }
        return false;
    }

    private placeBrick(brick: Brick): void {
        for (let x = brick[0].x; x <= brick[1].x; x++) {
            for (let y = brick[0].y; y <= brick[1].y; y++) {
                for (let z = brick[0].z; z <= brick[1].z; z++) {
                    this.grid[x][y][z] = brick;
                }
            }
        }
    }

    private getBricksOnTopOf(base: Brick): Brick[] {
        const zTop = base[1].z + 1;
        const topBricks: Brick[] = [];

        for (const otherBrick of this.bricks) {
            if (otherBrick === base || otherBrick[0].z !== zTop) continue;

            // the otherBrick is on the correct height. But is it on top?
            const supportingBricks: Brick[] = [];

            for (let x = otherBrick[0].x; x <= otherBrick[1].x; x++) {
                for (let y = otherBrick[0].y; y <= otherBrick[1].y; y++) {
                    const below = this.grid[x][y][base[1].z];
                    if (below && !supportingBricks.includes(below)) {
                       supportingBricks.push(below);
                    }
                }
            }

            // a brick is relying on the base, if the base is the one supporting brick
            if (supportingBricks.length === 1 && supportingBricks.includes(base)) {
                topBricks.push(otherBrick);
            }
        }
        return topBricks;
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2023_Day22_1());