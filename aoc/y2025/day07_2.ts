import AbstractRiddle from '../../src/JS/AbstractRiddle';


class  Y2025_Day07_2 extends AbstractRiddle {

    riddle: string = "In total, how many different timelines would a single tachyon particle end up on?";

    run(input: string[]): number {

        const grid = input.map(line => line.split(''));

        let lastBeamsPositions: number[] = grid.splice(0,1)[0].map(c => c === 'S' ? 1 : 0);

        const maxRowIndex = lastBeamsPositions.length - 1;

        for (let y = 0; y < grid.length; y++) {

            const nextBeamPositions = [...lastBeamsPositions].map(_ => 0);
            const row = grid[y];

            for (let x = 0; x < row.length; x++) {
                if (!lastBeamsPositions[x]) {
                    continue; // no beam reaches here, so we don't care
                }

                if (row[x] === '^') {
                    // split the beam
                    if (x > 0) nextBeamPositions[x-1] += lastBeamsPositions[x];
                    if (x < maxRowIndex) nextBeamPositions[x+1] += lastBeamsPositions[x];
                }
                else {
                    // continue the beam
                    nextBeamPositions[x] += lastBeamsPositions[x];
                }
            }

            lastBeamsPositions = nextBeamPositions;
        }

        return lastBeamsPositions.reduce((a: number,b: number)=> a + b);
    }



}

// noinspection JSUnusedGlobalSymbols
export default (new Y2025_Day07_2());