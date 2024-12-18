import * as fs from "fs";

export default abstract class AbstractRiddle {

    abstract riddle: string;

    abstract run(input?: string[]): number|BigInt|string;

    private year: string;
    private day: string;

    assert(cond: boolean, expectation: string = ''): void {
        if (!cond) {
            console.log('Assertion failed: ' + expectation);
            process.exit();
        }
    }

    dump(...vars: any[]): void {
        console.log(...vars);
    }

    dd(...vars: any[]): void {
        this.dump(...vars)
        process.exit();
    }

    setRiddleTime(year: string, day: string) {
        this.year = year;
        this.day = day;
    }

    readInput(): string[] {
        const filePath = `../../aoc/y${this.year}/files/day${this.day}.txt`;
        const contents =  fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });
        return contents.split('\n');
    }

    createArray<T>(size: number, defaultValue: T): T[] {
        return [...Array(size)].map(_ => defaultValue);
    }

    createMappedArray<T>(size: number, defaultValueMap: {(i: number): T}): T[] {
        return [...Array(size)].map((_,i) => defaultValueMap(i));
    }

    create2DArray<T>(width: number, height: number, defaultValueMap: {(x: number, y: number): T}): T[][] {
        return this.createMappedArray(height, (y) =>
            this.createMappedArray(width, x => defaultValueMap(x,y))
        );
    }

    copy2DArray<T,U>(original: T[][], valueMapping: {(old: T, x: number, y: number): U}): U[][] {
        return this.createMappedArray(original.length, (y) =>
            this.createMappedArray(original[0].length, x => valueMapping(original[y][x], x,y))
        );
    }

    create3DArray<T>(width: number, height: number, depth: number, defaultValueMap: {(x: number, y: number, z: number): T}): T[][][] {
        return this.createMappedArray(height, (y) =>
            this.createMappedArray(width, x =>
                this.createMappedArray(depth, z => defaultValueMap(x,y,z)))
        );
    }

    transpose2DArray<T>(matrix: T[][]): T[][] {
        return this.create2DArray(
            matrix.length,
            matrix[0].length,
            (x,y) => {
                return matrix[x][y];
            }
        );
    }

}