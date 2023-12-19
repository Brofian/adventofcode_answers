import AbstractRiddle from '../../src/JS/AbstractRiddle';

type Vector = {
    x: number,
    y: number,
};

class Y2023_Day15_1 extends AbstractRiddle {

    riddle: string = "Convert the instruction sequence into ascii helper codes";

    run(): number {
        const sequence: string[] = this.readInput()[0].trim().split(',');

        let sum = 0;
        for (const instruction of sequence) {
            sum += this.asciiStringHelperAlgorithm(instruction);
        }

        return sum;
    }


    protected asciiStringHelperAlgorithm(str: string): number {
        let currentValue = 0;

        for (const char of str) {
            currentValue += char.charCodeAt(0);
            currentValue *= 17;
            currentValue %= 256;
        }

        return currentValue;
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2023_Day15_1());