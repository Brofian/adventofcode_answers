import AbstractRiddle from '../../src/JS/AbstractRiddle';

type Vector = {
    x: number,
    y: number,
};

type Cosmos = string[][];

class Y2023_Day11_2 extends AbstractRiddle {

    expandedRows: boolean[] = [];
    expandedCols: boolean[] = [];

    riddle: string = "What is the sum of the shortest paths between all expanded galaxies?";

    run(): number {
        const cosmos: Cosmos = this.readInput().filter(el => el !== "").map((line) => {
            return line.split('');
        });

        this.expandCosmos(cosmos);

        const galaxies = this.findGalaxies(cosmos);

        let shortestPathSum: number = 0;

        for (let i = 0; i < galaxies.length; i++) {
            for (let k = i+1; k < galaxies.length; k++) {
                shortestPathSum += this.shortestPath(galaxies[i], galaxies[k]);
            }
        }


        return shortestPathSum;
    }


    shortestPath(start: Vector, end: Vector): number {
        let xSum = 0;
        let ySum = 0;
        const quantifier = 1000000;

        for (let x = start.x; x != end.x; (x > end.x) ? x-- : x++) {
            xSum += this.expandedCols[x] ? quantifier : 1;
        }
        for (let y = start.y; y != end.y; (y > end.y) ? y-- : y++) {
            ySum += this.expandedRows[y] ? quantifier : 1;
        }

        return xSum + ySum;
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

    expandCosmos(cosmos: Cosmos): void {
        for (let y = 0; y < cosmos.length; y++) {
            const isExpanded = cosmos[y].every(char => char === '.');
            this.expandedRows.push(isExpanded);
        }

        for (let x = 0; x < cosmos[0].length; x++) {
            const isExpanded = cosmos.every(row => row[x] === '.');
            this.expandedCols.push(isExpanded);
        }
    }


}

// noinspection JSUnusedGlobalSymbols
export default (new Y2023_Day11_2());