import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector from "../../src/JS/Geometry/Vector";

type Stone = {
    num: string;
    count: number;
}

class Y2024_Day11_2 extends AbstractRiddle {

    riddle: string = "How many stones would you have after blinking a total of 75 times?";

    run(input: string[]): number {
        this.assert(input.length === 1);

        let stones: {[key: string]: Stone} = {}

        input[0].split(' ').forEach(s => {
            if (stones[s]) {
                stones[s].count += 1;
            }
            else {
                stones[s] = {
                    num: s,
                    count: 1,
                }
            }
        });



        const blinks = 75;
        for (let blink = 0; blink < blinks; blink++) {
            let nextStones: typeof stones = {};

            for (const stone of Object.values(stones)) {

                if (stone.num === "0") {
                    if (!nextStones["1"]) {
                        nextStones["1"] = {
                            num: "1",
                            count: 0
                        };
                    }
                    nextStones["1"].count += stone.count;
                }
                else if (stone.num.length % 2 === 0) {
                    const firstHalf = parseInt(stone.num.substring(0,stone.num.length/2)) + '';
                    const secondHalf = parseInt(stone.num.substring(stone.num.length/2)) + '';
                    for (const target of [firstHalf, secondHalf]) {
                        if (!nextStones[target]) {
                            nextStones[target] = {
                                num: target,
                                count: 0
                            };
                        }
                        nextStones[target].count += stone.count;
                    }
                }
                else {
                    const target = (parseInt(stone.num) * 2024) + '';
                    if (!nextStones[target]) {
                        nextStones[target] = {
                            num: target,
                            count: 0
                        };
                    }
                    nextStones[target].count += stone.count;
                }

            }

            stones = nextStones;
        }

        return Object.values(stones).reduce((carry, stone) => carry + stone.count, 0);
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day11_2());