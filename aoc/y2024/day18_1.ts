import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector from "../../src/JS/Geometry/Vector";



class Y2024_Day18_1 extends AbstractRiddle {

    riddle: string = "what is the minimum number of steps needed to reach the exit?";

    run(input: string[]): string|number|bigint {

        const fallingBytes = input.map(line => {
            const [left, right] =  line.split(',');
            return Vector.create(
                parseInt(left),
                parseInt(right),
            );
        });


        const isExample = false;
        const width = isExample ? 6 : 70;
        const height = isExample ? 6 : 70;

        const map = this.create2DArray(width+1, height+1, () => false);

        const simulationDistance = isExample ? 12 : 1024;
        let simulatedBlocks = 0;
        while (simulatedBlocks++ < simulationDistance && fallingBytes.length) {
            const simulatedByte = fallingBytes.shift();
            // mark spot as corrupted
            map[simulatedByte.y][simulatedByte.x] = true;
        }

        const shortestPath = this.runDijkstra(map, Vector.create(0,0), Vector.create(width,height));

        return shortestPath.length-1; // do not count the starting position as a step
    }

    private runDijkstra(map: boolean[][], start: Vector, end: Vector): Vector[] {

        const costMap = this.copy2DArray(map, (old, x,y) => {
            const isStart = start.equalsRaw(x,y);
            return {
                cost: isStart ? 0 : Infinity,
                prev: isStart ? Vector.create(0,0) : undefined
            };
        })

        const positionQueue: Vector[] = [
            start
        ];

        const bounds: [Vector,Vector] = [
            Vector.create(0,0), Vector.create(map[0].length-1, map.length-1)
        ];

        const directions: Vector[] = [
            Vector.create(0,1),
            Vector.create(0,-1),
            Vector.create(1,0),
            Vector.create(-1,0),
        ];

        let checkedPositions = 0;
        while (positionQueue.length) {
            checkedPositions++;
            const currentPosition = positionQueue.shift();
            const currentCost = costMap[currentPosition.y][currentPosition.x];

            directions.forEach(direction => {

                const newPosition = currentPosition.clone().add(direction);
                if (newPosition.in(...bounds) && !map[newPosition.y][newPosition.x]) {
                    const newCost = costMap[newPosition.y][newPosition.x];

                    if (currentCost.cost+1 < newCost.cost) {
                        newCost.cost = currentCost.cost+1;
                        newCost.prev = direction.clone().scale(-1);
                        positionQueue.push(newPosition);
                    }
                }

            });

            if (currentPosition.equals(end)) {
                break; // we found the cheapest path
            }
        }
        this.dump(`> Checked ${checkedPositions} positions`);

        // backtrack
        const path: Vector[] = [end];
        while (!path[0].equalsRaw(0,0)) {
            const tile = costMap[path[0].y][path[0].x];
            path.unshift(path[0].clone().add(tile.prev))
        }


        /*
        this.dump(map.map((line,y) => {
            return line.map((cell,x) => {
                if (cell) {
                    return '#';
                }
                if (path.find(p => p.x === x && p.y === y)) {
                    return 'O';
                }
                return '.';
            }).join('')
        }).join('\n'));
        */

        return path;
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day18_1());