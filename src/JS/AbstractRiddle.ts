import * as fs from "fs";

export default abstract class AbstractRiddle {

    abstract riddle: string;

    abstract run(): number;

    private year: string;
    private day: string;


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

}