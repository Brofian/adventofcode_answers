import AbstractRiddle from '../../src/JS/AbstractRiddle';


class  Y2025_Day06_1 extends AbstractRiddle {

    riddle: string = "What is the grand total found by adding together all of the answers to the individual problems?";

    run(input: string[]): number {

        const matrix = input.map(line => line.split(' ').filter(v => '' != v));
        const transposedMatrix  = this.transpose2DArray(matrix);

        const operators = transposedMatrix.map(m => m.splice(-1, 1)[0]);
        const numbers = transposedMatrix.map(line => line.map(n => parseInt(n)));

        const operatorMap: {[key: string]: {(a:number,b:number): number}} = {
            '*': (a: number, b: number): number => a * b,
            '+': (a: number, b: number): number => a + b,
        }

        let sum = 0;

        for (let i = 0; i < operators.length; i++) {
            const fun = operatorMap[operators[i]] ?? undefined;
            sum += numbers[i].reduce(fun);
        }

        return sum;
    }



}

// noinspection JSUnusedGlobalSymbols
export default (new Y2025_Day06_1());