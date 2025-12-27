import AbstractRiddle from '../../src/JS/AbstractRiddle';

type Pos = {x: number, y: number};
const pos = (x: number, y: number): Pos => {
    return {x, y};
}
const abs = Math.abs;


class  Y2025_Day09_1 extends AbstractRiddle {

    riddle: string = "What is the largest area of any rectangle you can make?";

    run(input: string[]): number {

        const tiles: Pos[] = input.map(line => {
            const coord: number[] = line.split(',').map(x => parseInt(x));
            return pos(coord[0], coord[1]);
        });

        let largestSqrArea = 0;

        for (let i = 0; i < tiles.length; i++) {
            for (let e = i+1; e < tiles.length; e++) {
                const a = tiles[i];
                const b = tiles[e];

                const sqrArea = (abs(a.x - b.x) + 1) * (abs(a.y - b.y) + 1);
                if (largestSqrArea < sqrArea) {
                    largestSqrArea = sqrArea;
                    //console.log(`found ${a.x}|${a.y} to ${b.x}|${b.y} of ${sqrArea}`);
                }
            }
        }

        return largestSqrArea;
    }



}

// noinspection JSUnusedGlobalSymbols
export default (new Y2025_Day09_1());