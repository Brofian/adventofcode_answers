import AbstractRiddle from '../../src/JS/AbstractRiddle';


class  Y2025_Day07_1 extends AbstractRiddle {

    riddle: string = "How many times will the beam be split?";

    run(input: string[]): number {

        const grid = input.map(line => line.split(''));

        let lastBeamsPositions = grid.splice(0,1)[0].map(c => c === 'S');

        const maxRowIndex = lastBeamsPositions.length - 1;

        let numSplits = 0;

        for (let y = 0; y < grid.length; y++) {

            const nextBeamPositions = [...lastBeamsPositions].map(_ => false);
            const row = grid[y];

            for (let x = 0; x < row.length; x++) {
                if (!lastBeamsPositions[x]) {
                    continue; // no beam reaches here, so we don't care
                }

                if (row[x] === '^') {
                    // split the beam
                    if (x > 0) nextBeamPositions[x-1] = true;
                    if (x < maxRowIndex) nextBeamPositions[x+1] = true;

                    numSplits++;
                }
                else {
                    // continue the beam
                    nextBeamPositions[x] ||= lastBeamsPositions[x];
                }
            }

            lastBeamsPositions = nextBeamPositions;
        }

        return numSplits;
    }



}

// noinspection JSUnusedGlobalSymbols
export default (new Y2025_Day07_1());