import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector from '../../src/JS/Vector';

type CostMapTile = {
    lowestCost: {[key in Direction]: number[]},
    entryCost: number
};

type PathHead = {
    pos: Vector,
    steps: number,
    lastDirection: Direction,
    history: Vector[]
}

enum Direction {
    UP = 0,
    DOWN = 1,
    LEFT = 2,
    RIGHT = 3
}


class Y2023_Day17_1 extends AbstractRiddle {

    riddle: string = "What is the least heat loss it can incur while not going straight for more than three tiles?";

    run(): number {
        const map: CostMapTile[][] = this.readInput().map(line => line.trim().split('').map(el => {
            return {
                entryCost: parseInt(el),
                lowestCost: {
                    [Direction.UP]: [Infinity,Infinity,Infinity],
                    [Direction.DOWN]: [Infinity,Infinity,Infinity],
                    [Direction.LEFT]: [Infinity,Infinity,Infinity],
                    [Direction.RIGHT]: [Infinity,Infinity,Infinity],
                } // one lowest cost for: 2 steps left, 1 steps left and needing to turn next
            };
        }));

        const startingPosition: Vector = new Vector(0,0);
        const targetPosition: Vector = new Vector(map[0].length-1,map.length-1);

        map[0][0].lowestCost = {
            [Direction.UP]: [0,Infinity,Infinity],
            [Direction.DOWN]: [0,Infinity,Infinity],
            [Direction.LEFT]: [0,Infinity,Infinity],
            [Direction.RIGHT]: [0,Infinity,Infinity],
        };

        const tileQueue: PathHead[] = [{
            steps: 0,
            pos: startingPosition,
            lastDirection: Direction.DOWN, // because we do not count the start tile
            history: []
        }];

        let shortestPathCost: number = -1;

        let bestPath: Vector[] = [];

        let steps = 0;
        while (tileQueue.length) {
            steps++;

            // tile with the least costs at the start
            tileQueue.sort((tileA, tileB): number => {
                const tileACost = map[tileA.pos.y][tileA.pos.x].lowestCost[tileA.lastDirection][tileA.steps];
                const tileBCost = map[tileB.pos.y][tileB.pos.x].lowestCost[tileB.lastDirection][tileB.steps];
                return tileACost < tileBCost ? -1 : 1;
            });

            const currentTile = tileQueue.shift();

            const currentCost = map[currentTile.pos.y][currentTile.pos.x].lowestCost[currentTile.lastDirection][currentTile.steps];

            // console.log(`${tileQueue.length} tiles remaining.\t Current best cost: ${currentCost}`);

            if (currentTile.pos.equals(targetPosition)) {
                this.dump(`Reached the end after ${steps} steps!`);
                shortestPathCost = currentCost;
                bestPath = [...currentTile.history, currentTile.pos];
                break;
            }

            const wasGoingUp = currentTile.lastDirection === Direction.UP;
            const wasGoingDown = currentTile.lastDirection === Direction.DOWN;
            const wasGoingLeft = currentTile.lastDirection === Direction.LEFT;
            const wasGoingRight = currentTile.lastDirection === Direction.RIGHT;

            let canGoUp    = !wasGoingDown && !(wasGoingUp && currentTile.steps >= 2);
            let canGoDown  = !wasGoingUp && !(wasGoingDown && currentTile.steps >= 2);
            let canGoLeft  = !wasGoingRight && !(wasGoingLeft && currentTile.steps >= 2);
            let canGoRight = !wasGoingLeft && !(wasGoingRight && currentTile.steps >= 2);

            if (canGoUp && currentTile.pos.y > 0) {
                this.checkDirection(map, currentTile, tileQueue, Direction.UP, wasGoingUp, currentCost);
            }

            if (canGoDown && currentTile.pos.y < map.length-1) {
                this.checkDirection(map, currentTile, tileQueue, Direction.DOWN, wasGoingDown, currentCost);
            }

            if (canGoLeft && currentTile.pos.x > 0) {
                this.checkDirection(map, currentTile, tileQueue, Direction.LEFT, wasGoingLeft, currentCost);
            }

            if (canGoRight && currentTile.pos.x < map[0].length-1) {
                this.checkDirection( map, currentTile, tileQueue, Direction.RIGHT, wasGoingRight, currentCost);
            }
        }



        // print map
        for (let y = 0; y < map.length; y++) {
            let row = "";
            for (let x = 0; x < map[0].length; x++) {
                row += (bestPath.some(v => v.equals(new Vector(x,y)))) ? 'X' : '.';
            }
            console.log(row);
        }

        return shortestPathCost;
    }


    protected checkDirection(
        map: CostMapTile[][],
        currentTile: PathHead,
        queue: PathHead[],
        directionToCheck: Direction,
        wasGoingThatDirection: boolean,
        currentCost: number
    ): void
    {
        const nextPos = currentTile.pos.clone().add(this.getDirectionVector(directionToCheck));
        const tile = map[nextPos.y][nextPos.x];

        const newStep = wasGoingThatDirection ? currentTile.steps+1 : 0;
        const oldTileCost = tile.lowestCost[directionToCheck][newStep];
        const newTileCost = tile.entryCost + currentCost;

        if (newTileCost < oldTileCost) {
            tile.lowestCost[directionToCheck][newStep] = newTileCost;
            queue.push({
                pos: nextPos,
                lastDirection: directionToCheck,
                steps: newStep,
                history: [...currentTile.history, currentTile.pos]
            });
        }
    }

    protected invertDirection(dir: Direction): Direction {
        switch (dir) {
            case Direction.UP:      return Direction.DOWN;
            case Direction.DOWN:    return Direction.UP;
            case Direction.LEFT:    return Direction.RIGHT;
            case Direction.RIGHT:   return Direction.LEFT;
            default:                return undefined;
        }
    }

    protected getDirectionVector(dir: Direction): Vector {
        switch (dir) {
            case Direction.UP:      return new Vector( 0, -1);
            case Direction.DOWN:    return new Vector( 0,  1);
            case Direction.LEFT:    return new Vector(-1,  0);
            case Direction.RIGHT:   return new Vector( 1,  0);
        }
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2023_Day17_1());