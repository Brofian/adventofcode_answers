import AbstractRiddle from '../../src/JS/AbstractRiddle';

class Y2024_Day09_2 extends AbstractRiddle {

    riddle: string = "What is the resulting filesystem checksum?";

    run(input: string[]): number {
        this.assert(input.length === 1, 'Only one line of input');

        const disk: { id: number, amount: number }[] = input[0].split('').map((char, index) => {
            return {
                id: (index % 2) ?  -1 : Math.floor(index / 2),
                amount: parseInt(char)
            };
        });



        // fill gaps
        for (let i = disk.length-1; i > 0; i--) {

            const entry = disk[i];

            if (entry.id !== -1) {
                // attempt to place it as left as possible

                let wasPlaced = false;

                for (let e = 0; e < i; e++) {
                    if (disk[e].id === -1 && disk[e].amount >= entry.amount) {

                        if (disk[e].amount > entry.amount) {
                            // fill remaining space by inserting new item
                            disk.splice(e+1,0, {
                                id: -1,
                                amount: disk[e].amount - entry.amount
                            })
                            i++; // we shifted the number of elements up, so repeat the current i in the next iteration
                        }

                        // write entry to empty space
                        disk[e].id = entry.id;
                        disk[e].amount = entry.amount;

                        wasPlaced = true;
                        break;
                    }
                }

                if (wasPlaced) {
                    entry.id = -1;
                    // this.dump(disk.map(d => d.id.toString().replace('-1', '.').repeat(d.amount)).join(''));
                }
            }
        }

        // generate checksum
        let checksum = 0;
        let index = 0;
        disk.forEach(space => {
            if (space.id === -1) {
                index += space.amount;
                return;
            }
            for (let i = 0; i < space.amount; i++) {
                checksum += index * space.id;
                index++;
            }
        });

        return checksum;
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day09_2());