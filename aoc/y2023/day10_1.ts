import AbstractRiddle from '../../src/JS/AbstractRiddle';

type Vector = {
    x: number,
    y: number,
};

type tile = {
    leastDistanceFromStart?: number;
    north: boolean;
    south: boolean;
    west: boolean;
    east: boolean;
};

class Y2023_Day10_1 extends AbstractRiddle {

    riddle: string = "What is the distance of the pipe of the loop furthest away from the starting point?";

    run(): number {
        const startingPosition: Vector = {x: 0, y: 0};
        const grid: tile[][] = this.readInput().filter(el => el !== "").map((line, y) => {
            return line.split('').map((char, x) => {
                const newTile: tile = {
                    north: false,
                    south: false,
                    west: false,
                    east: false,
                };
                switch (char) {
                    case "|":
                        newTile.north = true;
                        newTile.south = true;
                        break;
                    case "-":
                        newTile.east = true;
                        newTile.west = true;
                        break;
                    case "L":
                        newTile.north = true;
                        newTile.east = true;
                        break;
                    case "F":
                        newTile.east = true;
                        newTile.south = true;
                        break;
                    case "J":
                        newTile.north = true;
                        newTile.west = true;
                        break;
                    case "7":
                        newTile.west = true;
                        newTile.south = true;
                        break;
                    case "S":
                        startingPosition.x = x;
                        startingPosition.y = y;
                        break;
                }
                return newTile;
            });
        });


        // figure out the starting position
        grid[startingPosition.y][startingPosition.x] = {
            leastDistanceFromStart: 0,
            north: grid[startingPosition.y-1][startingPosition.x].south,
            south: grid[startingPosition.y+1][startingPosition.x].north,
            east: grid[startingPosition.y][startingPosition.x+1].west,
            west: grid[startingPosition.y][startingPosition.x-1].east,
        };

        let furthest = 0;
        let firstRound = true;

        const tilesToCheck: Vector[] = [startingPosition];
        while (tilesToCheck.length > 0) {

            const currentTilePos = tilesToCheck.shift();
            const currentTile = grid[currentTilePos.y][currentTilePos.x];
            // update distance to start


            let nearestNeighbourDistance: number = (firstRound) ? -1 : Infinity;
            firstRound = false;


            if(currentTile.north) {
                const northNeighbour = grid[currentTilePos.y-1][currentTilePos.x];
                if (northNeighbour.south && northNeighbour.leastDistanceFromStart !== undefined) {
                    nearestNeighbourDistance = Math.min(nearestNeighbourDistance, northNeighbour.leastDistanceFromStart);
                }
                else if (northNeighbour.south) {
                    tilesToCheck.push({x: currentTilePos.x, y: currentTilePos.y - 1});
                }
            }

            if(currentTile.south) {
                const southNeighbour = grid[currentTilePos.y+1][currentTilePos.x];
                if (southNeighbour.north && southNeighbour.leastDistanceFromStart !== undefined) {
                    nearestNeighbourDistance = Math.min(nearestNeighbourDistance, southNeighbour.leastDistanceFromStart);
                }
                else if (southNeighbour.north) {
                    tilesToCheck.push({x: currentTilePos.x, y: currentTilePos.y + 1});
                }
            }

            if(currentTile.east) {
                const eastNeighbour = grid[currentTilePos.y][currentTilePos.x+1];
                if (eastNeighbour.west && eastNeighbour.leastDistanceFromStart !== undefined) {
                    nearestNeighbourDistance = Math.min(nearestNeighbourDistance, eastNeighbour.leastDistanceFromStart);
                }
                else if (eastNeighbour.west) {
                    tilesToCheck.push({x: currentTilePos.x+1, y: currentTilePos.y});
                }
            }

            if(currentTile.west) {
                const westNeighbour = grid[currentTilePos.y][currentTilePos.x-1];
                if (westNeighbour.east && westNeighbour.leastDistanceFromStart !== undefined) {
                    nearestNeighbourDistance = Math.min(nearestNeighbourDistance, westNeighbour.leastDistanceFromStart);
                }
                else if (westNeighbour.east) {
                    tilesToCheck.push({x: currentTilePos.x-1, y: currentTilePos.y});
                }
            }

            currentTile.leastDistanceFromStart = nearestNeighbourDistance + 1;
            furthest = Math.max(furthest, currentTile.leastDistanceFromStart);
        }

        return furthest;
    }


}

// noinspection JSUnusedGlobalSymbols
export default (new Y2023_Day10_1());