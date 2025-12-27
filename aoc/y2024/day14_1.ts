import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector from "../../src/JS/Geometry/Vector";


type Robot = {
    position: Vector;
    velocity: Vector;
}

class Y2024_Day14_1 extends AbstractRiddle {

    riddle: string = "What will the safety factor be after exactly 100 seconds have elapsed?";

    run(input: string[]): number {

        // p=0,4 v=3,-3
        const robots: Robot[] = input.map(line => {

            const regex = /^p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)$/;
            const match = line.match(regex);
            this.assert(match !== null, 'Line is well formated');

            return {
                position: Vector.create(parseInt(match[1]), parseInt(match[2])),
                velocity: Vector.create(parseInt(match[3]), parseInt(match[4]))
            };
        });


        const isExample = false;

        // in this riddle, we have different sizes for example and real data
        const width: number = isExample ? 11 : 101;
        const height: number = isExample ? 7 : 103;

        const seconds = 100;

        robots.forEach(robot => {
            robot.position.add(
                robot.velocity.scale(seconds)
            );
            robot.position.x %= width;
            robot.position.y %= height;
            while (robot.position.x < 0) robot.position.x += width;
            while (robot.position.y < 0) robot.position.y += height;

        });


        // count robots in each quadrant
        const widthMiddle = Math.floor(width / 2);
        const heightMiddle = Math.floor(height / 2);

        const quadrants: [number,number,number,number] = [
            0,0,0,0
        ];

        /*
        const testGrid = this.create2DArray(width, height, (x,y) => {
            if (x === widthMiddle || y === heightMiddle) return '  ';
            const r = robots.filter(robot => robot.position.x === x && robot.position.y === y);
            return ''+(r.length || '.');
        });
        this.dd(testGrid.map(line => line.join('')).join('\n'));
        */

        robots.forEach(robot => {
            const pos = robot.position;

            if (pos.x === widthMiddle || pos.y === heightMiddle) {
                return; // ignore robots in the middle
            }

            // simplify quadrant calculation by ignoring the removed row and column
            if (pos.x > widthMiddle)        pos.x--;
            if (pos.y > heightMiddle)       pos.y--;

            const xQ = Math.floor(pos.x / widthMiddle) as 0|1;
            const yQ = Math.floor(pos.y / heightMiddle) as 0|1;

            quadrants[xQ * 2 + yQ]++;
        });

        /*
        console.log(`Upper left: ${quadrants[0]}`);
        console.log(`Lower left: ${quadrants[1]}`);
        console.log(`Upper Right: ${quadrants[2]}`);
        console.log(`Lower Right: ${quadrants[3]}`);
        */

        return quadrants.reduce((c,n) => c*n, 1);
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day14_1());