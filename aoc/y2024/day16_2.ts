import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector from "../../src/JS/Geometry/Vector";

const WALL = '#';
const EMPTY = '.';
const START = 'S';
const END = 'E';

const directions = {
    north: Vector.create(0, -1),
    east: Vector.create(1, 0),
    south: Vector.create(0, 1),
    west: Vector.create(-1, 0),
}

type Direction = keyof typeof directions;

const availableRotations: { [key in Direction]: [Direction, Direction] } = {
    north: ['east', 'west'],
    east: ['north', 'south'],
    south: ['east', 'west'],
    west: ['north', 'south'],
}

type TileScore = { [key in Direction]: number };

type Reindeer = {
    position: Vector;
    facing: Direction;
    history: string[];
    cost: number;
}


class Y2024_Day16_2 extends AbstractRiddle {

    riddle: string = "How many tiles are part of at least one of the best paths through the maze?";

    run(input: string[]): number {

        const [target, start, tileMap] = this.readInputMap(input);


        const costMap = this.copy2DArray(tileMap, (cell): TileScore | undefined => {
            if (cell === WALL) {
                return undefined; // we do not need data for walls
            }
            return {
                north: Infinity,
                east: Infinity,
                south: Infinity,
                west: Infinity,
            };
        });
        costMap[start.y][start.x].east = 0; // the starting position costs nothing



        /*
            Run Dijkstra with an extra condition (turning has costs now)
         */

        let bestHistories: string[][] = [];
        let bestScore: number = Infinity;

        const reindeerQueue: Reindeer[] = [{
            position: start.clone(),
            facing: "east",
            history: [`${start.x}|${start.y}`],
            cost: 0,
        }];

        while (reindeerQueue.length) {
            const reindeer = reindeerQueue.shift();
            if (reindeer.position.equals(target)) {

                const reachedScore = reindeer.cost;
                if (reachedScore === bestScore) {
                    bestHistories.push(reindeer.history);
                }
                else if (reachedScore < bestScore) {
                    bestScore = reachedScore;
                    bestHistories = [reindeer.history];
                }

                continue; // nothing left to do here, we reached the goal
            }

            const currentTileCost = costMap[reindeer.position.y][reindeer.position.x][reindeer.facing];

            // a reindeer can either turn, or it can move forward (if there is no wall in front)

            // attempt walking forward
            const walkingVector = directions[reindeer.facing];
            const nextReindeerPosition = reindeer.position.clone().add(walkingVector);
            if (tileMap[nextReindeerPosition.y][nextReindeerPosition.x] === EMPTY) {
                const costWithMove = currentTileCost + 1;
                // check if the new position would become cheaper
                if (costMap[nextReindeerPosition.y][nextReindeerPosition.x][reindeer.facing] >= costWithMove) {
                    costMap[nextReindeerPosition.y][nextReindeerPosition.x][reindeer.facing] = costWithMove;
                    reindeerQueue.push({
                        position: nextReindeerPosition,
                        facing: reindeer.facing,
                        history: [...reindeer.history,`${nextReindeerPosition.x}|${nextReindeerPosition.y}`],
                        cost: reindeer.cost + 1
                    });
                }
            }

            // attempt rotating
            const costWithRotation = currentTileCost + 1000;
            for (const newFacing of availableRotations[reindeer.facing]) {
                // check if the new direction would become cheaper
                if (costMap[reindeer.position.y][reindeer.position.x][newFacing] >= costWithRotation) {
                    // move there! It improves the best score
                    costMap[reindeer.position.y][reindeer.position.x][newFacing] = costWithRotation;
                    reindeerQueue.push({
                        position: reindeer.position.clone(),
                        facing: newFacing,
                        history: reindeer.history,
                        cost: reindeer.cost + 1000
                    })
                }
            }

        }


        // count tiles
        let totalTiles = 0;
        const tileCache: {[key: string]: boolean} = {};
        for (const history of bestHistories) {
            for (const pos of history) {
                if (!tileCache[pos]) {
                    tileCache[pos] = true;
                    totalTiles++;
                }
            }
        }

        return totalTiles;
    }

    private readInputMap(input: string[]): [Vector, Vector, string[][]] {
        const target: Vector = Vector.create(0, 0);
        const start: Vector = Vector.create(0, 0);

        const map: string[][] = input.map((line, y) =>
            line.split('').map((cell, x) => {
                if (cell === START) {
                    start.set(x, y);
                    return EMPTY;
                }
                if (cell === END) {
                    target.set(x, y);
                    return EMPTY;
                }
                return cell;
            })
        );

        return [target, start, map];
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day16_2());