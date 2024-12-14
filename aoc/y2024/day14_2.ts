import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector from "../../src/JS/Vector";


type Robot = {
    position: Vector;
    velocity: Vector;
}

class Y2024_Day14_2 extends AbstractRiddle {

    riddle: string = "What is the fewest number of seconds that must elapse for the robots to display the Easter egg?";

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


        let seconds = 0;

        while (!this.isPotentialChristmasTree(robots, Vector.create(width, height))) {
            // simulate robots one step
            // if (seconds % 1000 === 0) console.log(seconds);
            seconds++;

            robots.forEach(robot => {
                robot.position.add(robot.velocity);
                robot.position.x %= width;
                robot.position.y %= height;
                while (robot.position.x < 0) robot.position.x += width;
                while (robot.position.y < 0) robot.position.y += height;
            });
        }

/*
        const testGrid = this.create2DArray(width, height, (x,y) => {
            const r = robots.filter(robot => robot.position.x === x && robot.position.y === y);
            if (r.length === 0) return '.';
            if (r.length > 9) return 'X';
            return ''+r.length;
        });
        this.dump(testGrid.map(line => line.join('')).join('\n'));
*/

        return seconds;
    }

    private isPotentialChristmasTree(robots: Robot[], bounds: Vector): boolean {

        // create indexed object for fast position checks
        const fastCheck: {[key: string]: boolean} = {};
        robots.forEach(robot => {
            fastCheck[robot.position.toString()] = true;
        });


        for (const robot of robots) {

            // check if this robot creates a vertical or horizontal line
            const posToCheck = robot.position.clone();

            const minLength = 10;

            let foundLength = 0;
            for (let i = 0; fastCheck[posToCheck.toString()]; i++) {
                foundLength++;
                posToCheck.x += 1;
                if (foundLength >= minLength) {
                    return true;
                }
            }

            foundLength = 0;
            posToCheck.pull(robot.position);
            for (let i = 0; fastCheck[posToCheck.toString()]; i++) {
                foundLength++;
                posToCheck.y += 1;
                if (foundLength >= minLength) {
                    return true;
                }
            }
        }

        return false;
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day14_2());