import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector from "../../src/JS/Geometry/Vector";



class Y2024_Day18_2 extends AbstractRiddle {

    riddle: string = "What are the coordinates of the first byte that will prevent the exit from being reachable from your starting position?";

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

        let isBlocked = false;
        let shortestPath: Vector[] = [];

        let preSimulatedBlocks = 0;
        let lastSimulatedByte: Vector;
        while (!isBlocked && fallingBytes.length) {
            const simulatedByte = fallingBytes.shift();
            lastSimulatedByte = simulatedByte;
            // mark spot as corrupted
            map[simulatedByte.y][simulatedByte.x] = true;

            preSimulatedBlocks++;
            if (preSimulatedBlocks > 1024) {

                if (shortestPath.length === 0 || !this.validateShortestPath(map, shortestPath)) {
                    // attempt to find a new shortest path
                    shortestPath = this.runDijkstra(map, Vector.create(0,0), Vector.create(width,height));
                }

                if (shortestPath === undefined) {
                    // dijkstra did not find a valid path
                    break;
                }
            }
        }

        return lastSimulatedByte.x + ',' + lastSimulatedByte.y;
    }

    private validateShortestPath(map: boolean[][], path: Vector[]): boolean {
        return path.every(tile => !map[tile.y][tile.x]); // ensure, no path tile is corrupted
    }

    private runDijkstra(map: boolean[][], start: Vector, end: Vector): Vector[]|undefined {

        const costMap = this.copy2DArray(map, (_, x,y) => {
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

            // sort positions while keeping the shortest path in front (A*)
            /* positionQueue.sort((a,b) => {
                const aCost = costMap[a.y][a.x].cost;
                const bCost = costMap[b.y][b.x].cost;

                const aDist = Math.abs(end.x - a.x) + Math.abs(end.y - a.y);
                const bDist = Math.abs(end.x - b.x) + Math.abs(end.y - b.y);

                return (aCost + aDist) < (bCost + bDist) ? -1 : 1;
            }); */
        }
        //this.dump(`> Checked ${checkedPositions} positions`);

        if (costMap[end.y][end.x].cost === Infinity) {
            return undefined; // no path available
        }

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
export default (new Y2024_Day18_2());