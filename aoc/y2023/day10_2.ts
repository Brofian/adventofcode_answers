import AbstractRiddle from '../../src/JS/AbstractRiddle';

type Vector = {
    x: number,
    y: number,
};

type tile = {
    isLoopTile: boolean;
    loopSidesOnRight: number;
    north: boolean;
    south: boolean;
    west: boolean;
    east: boolean;
};

class Y2023_Day10_1 extends AbstractRiddle {

    riddle: string = "How many tiles are enclosed by the loop?";

    run(): number {
        const startingPosition: Vector = {x: 0, y: 0};
        const grid: tile[][] = this.readInput().filter(el => el !== "").map((line, y) => {
            return line.split('').map((char, x) => {
                const newTile: tile = {
                    north: false,
                    south: false,
                    west: false,
                    east: false,
                    loopSidesOnRight: 0,
                    isLoopTile: false,
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
            north:  startingPosition.y > 0 && grid[startingPosition.y-1][startingPosition.x].south,
            south:  startingPosition.y < (grid.length-1) && grid[startingPosition.y+1][startingPosition.x].north,
            east:   startingPosition.x < (grid[0].length-1) && grid[startingPosition.y][startingPosition.x+1].west,
            west:   startingPosition.x > 0 && grid[startingPosition.y][startingPosition.x-1].east,
            loopSidesOnRight: 0,
            isLoopTile: true
        };


        const tilesToCheck: Vector[] = [startingPosition];

        while (tilesToCheck.length > 0) {
            const currentTilePos = tilesToCheck.shift();
            const currentTile = grid[currentTilePos.y][currentTilePos.x];

            currentTile.isLoopTile = true;

            if(currentTile.north) {
                const northNeighbour = grid[currentTilePos.y-1][currentTilePos.x];
                if (northNeighbour.south && !northNeighbour.isLoopTile) {
                    tilesToCheck.push({x: currentTilePos.x, y: currentTilePos.y - 1});
                }
            }

            if(currentTile.south) {
                const southNeighbour = grid[currentTilePos.y+1][currentTilePos.x];
                if (southNeighbour.north && !southNeighbour.isLoopTile) {
                    tilesToCheck.push({x: currentTilePos.x, y: currentTilePos.y + 1});
                }
            }

            if(currentTile.east) {
                const eastNeighbour = grid[currentTilePos.y][currentTilePos.x+1];
                if (eastNeighbour.west && !eastNeighbour.isLoopTile) {
                    tilesToCheck.push({x: currentTilePos.x+1, y: currentTilePos.y});
                }
            }

            if(currentTile.west) {
                const westNeighbour = grid[currentTilePos.y][currentTilePos.x-1];
                if (westNeighbour.east && !westNeighbour.isLoopTile) {
                    tilesToCheck.push({x: currentTilePos.x-1, y: currentTilePos.y});

                }
            }
        }


        let tilesInsideLoop = 0;

        for (let y = 0; y < grid.length; y++) {

            // detect rightmost tile
            {
                const tile = grid[y][grid[0].length-1];
                if(tile.isLoopTile) {
                    tile.loopSidesOnRight = (tile.north ? 1 : 0);
                }
            }

            // detect other tiles
            for (let x = grid[0].length-2; x >= 0; x--) {

                const tile = grid[y][x];
                const prevTile = grid[y][x+1];
                if(tile.isLoopTile) {
                    tile.loopSidesOnRight = prevTile.loopSidesOnRight + (tile.north ? 1 : 0);
                }
                else {
                    tile.loopSidesOnRight = prevTile.loopSidesOnRight;

                    if (tile.loopSidesOnRight%2==1) {
                        tilesInsideLoop++;
                        // console.log(`tile at ${x}|${y} is inside the loop with ${tile.loopSidesOnRight} sides to the right`);
                    }
                }


            }
        }


        return tilesInsideLoop;
    }


}

// noinspection JSUnusedGlobalSymbols
export default (new Y2023_Day10_1());