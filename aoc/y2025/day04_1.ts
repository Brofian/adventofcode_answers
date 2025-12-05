import AbstractRiddle from '../../src/JS/AbstractRiddle';

type Position = {x: number, y: number};
const pos = (x: number, y: number): Position => {
    return {x: x, y: y}
};

class Y2025_Day04_1 extends AbstractRiddle {

    riddle: string = "How many rolls of paper can be accessed by a forklift?";

    run(input: string[]): number {

        const grid = input.map((row, y) => {
            return row.split('').map((cell, x) =>
                cell === '@'
            );
        });
        const gridHeight = grid.length;
        const gridWidth = grid[0].length;

        let accessiblePaperRolls = 0;

        for (let x = 0; x < gridWidth; x++) {
            for (let y = 0; y < gridHeight; y++) {
                if (!grid[y][x]) continue;

                let totalNeighbourRolls = 0;

                // cardinal directions
                if (x > 0               && grid[y][x-1]) totalNeighbourRolls++;
                if (y > 0               && grid[y-1][x]) totalNeighbourRolls++;
                if (x < gridWidth-1     && grid[y][x+1]) totalNeighbourRolls++;
                if (y < gridHeight-1    && grid[y+1][x]) totalNeighbourRolls++;

                // diagonals
                if (x > 0 && y > 0                      && grid[y-1][x-1]) totalNeighbourRolls++;
                if (x > 0 && y < gridHeight-1           && grid[y+1][x-1]) totalNeighbourRolls++;
                if (x < gridWidth-1 && y > 0            && grid[y-1][x+1]) totalNeighbourRolls++;
                if (x < gridWidth-1 && y < gridHeight-1 && grid[y+1][x+1]) totalNeighbourRolls++;

                if (totalNeighbourRolls < 4) {
                    accessiblePaperRolls++;
                }
            }
        }

        return accessiblePaperRolls;
    }



}

// noinspection JSUnusedGlobalSymbols
export default (new Y2025_Day04_1());