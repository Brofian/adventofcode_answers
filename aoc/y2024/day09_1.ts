import AbstractRiddle from '../../src/JS/AbstractRiddle';

class Y2024_Day09_1 extends AbstractRiddle {

    riddle: string = "What is the resulting filesystem checksum?";

    run(input: string[]): number {
        this.assert(input.length === 1, 'Only one line of input');

        const disk: number[] = [];
        input[0].split('').forEach((char, i) => {
            const amount = parseInt(char);
            const index = (i % 2) ? -1 : Math.floor(i / 2);
            disk.push(...[...Array(amount)].map((_,i) => index));
        })


        // fill gaps
        let leftFillStart = 0;
        for (let i = disk.length-1; i > 0; i--) {

            const id = disk[i];
            if (id !== -1) {
                // attempt to place it as left as possible

                let wasPlaced = false;

                for (let e = leftFillStart; e < i; e++) {
                    if (disk[e] === -1) {
                        disk[e] = id;
                        wasPlaced = true;
                        leftFillStart = e;
                        break;
                    }
                }

                if (wasPlaced) {
                    disk[i] = -1;
                }
                else {
                    break; // we cannot do more
                }
            }
        }


        // generate checksum
        return disk.reduce((carry, number, index) => {
            if (number === -1) return carry;
            return carry + number * index;
        }, 0);
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day09_1());