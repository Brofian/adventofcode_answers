import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector from "../../src/JS/Geometry/Vector";

class Y2024_Day11_1 extends AbstractRiddle {

    riddle: string = "How many stones will you have after blinking 25 times?";

    run(input: string[]): number {
        this.assert(input.length === 1);

        const stones: string[] = input[0].split(' ');

        const blinks = 25;
        for (let blink = 0; blink < blinks; blink++) {

            for (let i = 0; i < stones.length; i++) {
                const stone = stones[i];

                if (stone === '0') {
                    stones[i] = '1';
                }
                else if (stone.length % 2 === 0) {
                    stones.splice(i, 1,
                        parseInt(stone.substring(0,stone.length/2)) + '',
                        parseInt(stone.substring(stone.length/2)) + '',
                    );
                    i++;
                }
                else {
                    stones[i] = (parseInt(stone) * 2024) + '';
                }
            }
        }

        return stones.length;
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day11_1());