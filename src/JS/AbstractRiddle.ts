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

}