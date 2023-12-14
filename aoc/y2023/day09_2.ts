import AbstractRiddle from '../../src/JS/AbstractRiddle';

type history = number[][];

class Y2023_Day09_1 extends AbstractRiddle {

    riddle: string = "Extrapolate the data to get another value at the start. What is the sum of the new values?";

    run(): number {
        const histories: history[] = this.readInput().filter(el => el !== "").map(line => {
            return [line.split(' ').map(el => parseInt(el))];
        });

        for (const history of histories) {

            while (!history[history.length-1].every(el => el === 0)) {
                const prevHistoryState = history[history.length-1];
                const newState = [];
                for (let i = 1; i < prevHistoryState.length; i++) {
                    newState.push(prevHistoryState[i] - prevHistoryState[i-1]);
                }
                history.push(newState);
            }

            history[history.length - 1].unshift(0);
            for (let level = history.length-2; level >= 0; level--) {
                const sibling = history[level][0];
                const diff = history[level+1][0];

                // diff = sibling - new
                // new = sibling - diff
                let newNumber = sibling - diff;
                history[level].unshift(newNumber);
            }
        }

        let sum = 0;
        for (const history of histories) {
            sum += history[0].shift();
        }

        return sum;
    }


}

// noinspection JSUnusedGlobalSymbols
export default (new Y2023_Day09_1());