import AbstractRiddle from '../../src/JS/AbstractRiddle';

type Shape = boolean[][];
class ShapeCls {

    variations: Shape[] = [];
    tiles: number;

    constructor(base: Shape) {
        const mirror = this.mirrorShape(base);
        const variations = [base, mirror];

        for (let i = 0; i < 3; i++) {
            const lastBase = variations[variations.length - 2];
            const lastMirror = variations[variations.length - 1];

            variations.push(this.rotateShape(lastBase));
            variations.push(this.rotateShape(lastMirror));
        }

        // filter duplicates
        for (let i = 0; i < variations.length; i++) {
            // delete all equals afterwards
            for (let e = variations.length - 1; e > i; e--) {
                if (this.shapeEquals(variations[i], variations[e])) {
                    variations.splice(e, 1);
                }
            }
        }

        this.variations = variations;
        this.tiles = base.reduce((acc1, row) =>
            acc1 + row.reduce((acc2, cell) =>
                    acc2 + (cell ? 1 : 0)
                ,0), 0);
    }

    rotateShape(shape: Shape): Shape {
        return shape.map((row, y) =>
            row.map((_, x) =>
                shape[x][y]
            ).reverse());
    }

    mirrorShape(shape: Shape): Shape {
        return shape.map(row =>
            row.map((_,i) =>
                row[row.length - 1 - i]
        ));
    }

    shapeEquals(shapeA: Shape, shapeB: Shape): boolean {
        return shapeA.every((row, y) =>
            row.every((c, x) =>
                c === shapeB[y][x]
            ));
    }
}
type Region = {
    width: number;
    height: number;
    requirements: number[];
};

class Y2025_Day12_1 extends AbstractRiddle {

    riddle: string = "How many of the regions can fit all of the presents listed?";

    shapes: ShapeCls[] = [];

    cache: {[key: string]: boolean} = {};

    run(input: string[]): number {
        const regions = this.parseInput(input);

        // brute force
        let possibleRegions = 0;

        for (const region of regions) {
            if (this.worksWithoutInterlocking(region)) {
                possibleRegions++;
                //console.log('Region is possible without interlocking');
                continue;
            }

            if (this.neverWorks(region)) {
                //console.log('Region is never possible');
                continue;
            }

            // try fitting them
            this.cache = {}; //  clear cache
            const emptyGrid = this.create2DArray(region.height, region.width, _ => false);

            const isPossible = this.bruteForceRegion(emptyGrid, region.requirements);
            console.log('Region is possible: ' + isPossible);
            if (isPossible) {
                possibleRegions++;
            }
        }

        return possibleRegions;
    }

    neverWorks(region: Region): boolean {
        const shapeTiles = region.requirements.reduce((acc,n, i) =>
            acc + n * this.shapes[i].tiles, 0);
        const totalTiles = region.width * region.height;
        return shapeTiles > totalTiles;
    }

    worksWithoutInterlocking(region: Region): boolean {
        const shapes = region.requirements.reduce((acc,n) => acc + n);
        const singleCellGroups = Math.floor(region.width / 3) * Math.floor(region.height / 3);
        return shapes < singleCellGroups;
    }

    bruteForceRegion(grid: boolean[][], requirements: number[]): boolean {
        const nextShapeIndex = requirements.findIndex(n => n > 0);
        if (nextShapeIndex === -1) {
            return true; // we managed all presents!
        }

        const cacheKey = this.cacheKey(grid, requirements);
        if (this.cache[cacheKey] !== undefined) {
            return this.cache[cacheKey];
        }

        const shape = this.shapes[nextShapeIndex];
        const newRequirements = [...requirements];
        newRequirements[nextShapeIndex]--;

        // it is enough to find one matching path
        for (const shapeVariation of shape.variations) {
            const h = shapeVariation.length;
            const w = shapeVariation[0].length;

            for (let y = 0; y < grid.length - h + 1; y++) {
                for (let x = 0; x < grid[0].length - w + 1; x++) {
                    if (this.canShapeBePlaced(shapeVariation, grid, y, x)) {
                        // this works! Continue from here...
                        const works = this.bruteForceRegion(
                            this.placeShape(shapeVariation, grid, y, x),
                            newRequirements
                        )

                        if (works) {
                            this.cache[cacheKey] = true;
                            return true; // one is enough for now
                        }
                    }
                }
            }
        }

        this.cache[cacheKey] = false;
        return false;
    }

    cacheKey(g: boolean[][], req: number[]): string {
        return g
            .map(row => row
                .map(cell => cell ? '#' : '.').join(''))
            .join('|')
            + ';' +
            req.join(';');
    }

    grid2String(g: boolean[][]): string {
        return g
            .map(row => row
                .map(cell => cell ? '#' : '.').join(''))
            .join('\n') + '\n';
    }

    canShapeBePlaced(shape: Shape, grid: boolean[][], y: number, x: number): boolean {
        return shape.every((row, yOffset) => {
            return row.every((cell, xOffset) => {
                return !cell || !grid[y + yOffset][x + xOffset];
            })
        });
    }

    placeShape(shape: Shape, grid: boolean[][], y: number, x: number): boolean[][] {
        const newGrid: boolean[][] = this.copy2DArray(grid);
        shape.forEach((row, yOffset) => {
            row.forEach((cell, xOffset) => {
                newGrid[y + yOffset][x + xOffset] ||= cell;
            })
        });
        return newGrid;
    }

    parseInput(lines: string[]): Region[] {
        const regions: Region[] = [];

        for (let i = 0; i < lines.length; i++) {

            if (lines[i].match(/^\d+:/)) {
                this.shapes.push(new ShapeCls([
                    lines[i+1].split('').map(c => c === '#'),
                    lines[i+2].split('').map(c => c === '#'),
                    lines[i+3].split('').map(c => c === '#'),
                ]));
                i += 4;
            }
            else {
                const [l,r] = lines[i].split(': ', 2);
                const [w,h] = l.split('x').map(d => parseInt(d));
                const req = r.split(' ').map(d => parseInt(d));
                regions.push({
                    width: w,
                    height: h,
                    requirements: req
                });
            }
        }

        return regions;
    }
}

// noinspection JSUnusedGlobalSymbols
export default (new Y2025_Day12_1());