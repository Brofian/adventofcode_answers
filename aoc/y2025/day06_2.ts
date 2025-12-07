import AbstractRiddle from '../../src/JS/AbstractRiddle';


class  Y2025_Day06_1 extends AbstractRiddle {

    riddle: string = "What is the grand total found by adding together all of the answers to the individual problems?";

    run(input: string[]): number {

        const operators = input.splice(-1, 1)[0].split(' ').filter(v => !!v);

        let longestInputLine = input.reduce((acc,line) => Math.max(acc, line.length), 0);
        // @ts-ignore
        const inputMatrix: string[][] = input.map(line => line.padEnd(longestInputLine, ' ').split(''));

        const nums: number[][] = [[]];
        this.transpose2DArray(inputMatrix).map(numStrings =>
            parseInt(numStrings.join(''))
        ).forEach(num => {
            if (isNaN(num)) {
                nums.push([]);
                return;
            }
            nums[nums.length-1].push(num); // add to last list
        });


        const operatorMap: {[key: string]: {(a:number,b:number): number}} = {
            '*': (a: number, b: number): number => a * b,
            '+': (a: number, b: number): number => a + b,
        }

        let sum = 0;

        for (let i = 0; i < operators.length; i++) {
            const fun = operatorMap[operators[i]] ?? undefined;
            sum += nums[i].reduce(fun);
        }

        return sum;
    }



}

// noinspection JSUnusedGlobalSymbols
export default (new Y2025_Day06_1());