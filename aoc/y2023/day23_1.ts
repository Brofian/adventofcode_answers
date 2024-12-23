import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector from "../../src/JS/Vector";
import Vector3D from "../../src/JS/Vector3D";

type PrevDirection = [number,number,number]|undefined;

class Y2023_Day23_1 extends AbstractRiddle {

    riddle: string = "How many steps long is the longest hike?";

    grid: string[][];

    run(input: string[]): number {

        this.grid = input.map(line => line.split(''));
        this.assert(this.grid.length > 1 && this.grid[0].length > 1, "Grid is not empty");
        const width = this.grid[0].length,
            height = this.grid.length;

        const start = new Vector(this.grid[0].findIndex(t => t === '.'), 0);
        const goal = new Vector(this.grid[height-1].findIndex(t => t === '.'), height-1);

        // Dijkstra with inverse rating (longer paths are better)

        const prevGrid: PrevDirection[][] = this.create2DArray(height, width, (_): [number, number, number]|undefined => undefined);
        prevGrid[start.y][start.x] = [0,0,0]; // no prev direction and zero distance to the start

        const queue: Vector[] = [start];

        let currentTile;
        while (currentTile = queue.shift()) { // search first found tiles first
            if (this.grid[currentTile.y][currentTile.x] === '#') continue; // ignore walls

            let currentPrev = prevGrid[currentTile.y][currentTile.x] || [0,0,0];
            let neighbour: PrevDirection|undefined|null = null;

            if (currentTile.x > 0 && (neighbour = prevGrid[currentTile.y][currentTile.x-1]) && ['.','>'].includes(this.grid[currentTile.y][currentTile.x-1])) {
                if (currentPrev[2]-1 < neighbour[2]) {
                    currentPrev = [-1,0,neighbour[2]+1];
                }
            }
            else if (neighbour === undefined) {
                queue.push(Vector.create(currentTile.x-1,currentTile.y));
            }
            neighbour = null;

            if (currentTile.y > 0 && (neighbour = prevGrid[currentTile.y-1][currentTile.x]) && ['.','v'].includes(this.grid[currentTile.y-1][currentTile.x])) {
                if (currentPrev[2]-1 < neighbour[2]) {
                    currentPrev = [0,-1,neighbour[2]+1];
                }
            }
            else if (neighbour === undefined) {
                queue.push(Vector.create(currentTile.x,currentTile.y-1));
            }
            neighbour = null;

            if (currentTile.x < width-1 && (neighbour = prevGrid[currentTile.y][currentTile.x+1]) && ['.','<'].includes(this.grid[currentTile.y][currentTile.x+1])) {
                if (currentPrev[2]-1 < neighbour[2]) {
                    currentPrev = [1,0,neighbour[2]+1];
                }
            }
            else if (neighbour === undefined) {
                queue.push(Vector.create(currentTile.x+1,currentTile.y));
            }
            neighbour = null;

            if (currentTile.y < height-1 && (neighbour = prevGrid[currentTile.y+1][currentTile.x]) && ['.','^'].includes(this.grid[currentTile.y+1][currentTile.x])) {
                if (currentPrev[2]-1 < neighbour[2]) {
                    currentPrev = [0,1,neighbour[2]+1];
                }
            }
            else if (neighbour === undefined) {
                queue.push(Vector.create(currentTile.x,currentTile.y+1));
            }

            prevGrid[currentTile.y][currentTile.x] = currentPrev;
        }


/*        console.log(prevGrid.map(line => line.map(
            cell => {
                //return cell ? cell[2].toString().padStart(2,' ') : '??';
                if (!cell) return '..';
                if (cell[1] === 0) return cell[0] < 0 ? '<<' : '>>';
                return cell[1] < 0 ? '^^' : 'vv';
            }
        ).join('')).join("\n"));*/

        // now backtrack
        const currentPos = goal.clone();
        let steps = 0;
        while (!currentPos.equals(start)) {
            const prev = prevGrid[currentPos.y][currentPos.x];
            this.assert(prev !== undefined, 'Previous path exists');

            currentPos.x += prev[0];
            currentPos.y += prev[1];
            prev[2] = -1;

            steps++;
        }


        console.log(prevGrid.map((line,y) => line.map(
            (cell,x) => {
                if (!cell) return this.grid[y][x];
                if (cell[2] !== -1) return this.grid[y][x].replace('.',' ');
                if (cell[1] === 0) return cell[0] < 0 ? '<' : '>';
                return cell[1] < 0 ? '^' : 'v';
            }
        ).join('')).join("\n"));

        return steps;
    }


}

// noinspection JSUnusedGlobalSymbols
export default (new Y2023_Day23_1());