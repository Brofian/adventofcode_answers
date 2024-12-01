import AbstractRiddle from '../../src/JS/AbstractRiddle';

class Y2024_Day01_1 extends AbstractRiddle {

    riddle: string = "What is their similarity score?";

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


        let similarityScore: number = 0;
        let rightStartingIndex: number = 0;
        const memory: {[key: string]: number} = {};

        for (const left of leftList) {
            // if we have encountered this number before, reuse the previous result
            if (memory[left]) {
                similarityScore += memory[left];
            }

            let occurrencesInRightList: number = 0;

            for (let i = rightStartingIndex; i < rightList.length; i++) {
                const right = rightList[i];

                if (right === left) {
                    occurrencesInRightList++;
                }
                else if (right > left) {
                    rightStartingIndex = i;
                    break;
                }
            }

            const score = left * occurrencesInRightList;
            similarityScore += score;
            memory[left] = score;
        }

        return similarityScore;
    }



}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day01_1());