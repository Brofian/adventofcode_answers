import AbstractRiddle from '../../src/JS/AbstractRiddle';

type Vector = {
    x: number,
    y: number,
};

type Cosmos = string[][];

class Y2023_Day11_1 extends AbstractRiddle {

    riddle: string = "What is the sum of the shortest paths between all galaxies?";

    run(): number {
        const cosmos: Cosmos = this.readInput().filter(el => el !== "").map((line) => {
            return line.split('');
        });

        const expandedCosmos = this.expandCosmos(cosmos);

        const galaxies = this.findGalaxies(expandedCosmos);

        let shortestPathSum: number = 0;

        for (let i = 0; i < galaxies.length; i++) {
            for (let k = i+1; k < galaxies.length; k++) {
                shortestPathSum += this.shortestPath(galaxies[i], galaxies[k]);
            }
        }


        return shortestPathSum;
    }


    shortestPath(start: Vector, end: Vector): number {
        return Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
    }

    findGalaxies(cosmos: Cosmos): Vector[] {
        const galaxies: Vector[] = [];
        for (let y = 0; y < cosmos.length; y++) {
            for (let x = 0; x < cosmos[0].length; x++) {
                if (cosmos[y][x] === '#') {
                    galaxies.push({
                        x: x, y: y
                    });
                }
            }
        }
        return galaxies;
    }

    expandCosmos(cosmos: Cosmos): Cosmos {
        const expandedCosmos: Cosmos = [];
        for (const row of cosmos) {
            if (row.every(char => char === '.')) {
                expandedCosmos.push(row);
                expandedCosmos.push([...row]);
            }
            else {
                expandedCosmos.push(row);
            }
        }

        for (let x = expandedCosmos[0].length-1; x >= 0; x--) {
            if (expandedCosmos.every(row => row[x] === '.')) {
                // double this column
                for (let y = 0; y < expandedCosmos.length; y++) {
                    expandedCosmos[y].splice(x+1, 0, '.');
                }
            }
        }

        return expandedCosmos;
    }


}

// noinspection JSUnusedGlobalSymbols
export default (new Y2023_Day11_1());