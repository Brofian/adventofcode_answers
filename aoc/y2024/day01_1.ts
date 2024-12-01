import AbstractRiddle from '../../src/JS/AbstractRiddle';

class Y2024_Day01_1 extends AbstractRiddle {

    riddle: string = "What is the total distance between your lists?";

    run(input: string[]): number {

        const leftList: number[] = [];
        const rightList: number[] = [];

        for (const line of input) {
            const [left,right] = line.split('   ');
            leftList.push(parseInt(left));
            rightList.push(parseInt(right));
        }

        leftList.sort();
        rightList.sort();

        let sumOfDiffs: number = 0;

        for (let i = 0; i < leftList.length; i++) {
            const left = leftList[i];
            const right = rightList[i];
            sumOfDiffs += Math.abs(left - right);
        }

        return sumOfDiffs;
    }



}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day01_1());