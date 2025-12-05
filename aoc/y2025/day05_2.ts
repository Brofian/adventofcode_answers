import AbstractRiddle from '../../src/JS/AbstractRiddle';


class  Y2025_Day05_2 extends AbstractRiddle {

    riddle: string = "How many ingredient IDs are considered to be fresh according to the fresh ingredient ID ranges?";

    run(input: string[]): number {

        const freshIngredientIdRanges: number[][] = [];
        for (const line of input) {
            if (line === '') break;

            const range = line.split('-',2).map(n => parseInt(n));
            freshIngredientIdRanges.push(range);
        }

        // merge overlapping ranges
        let continueMerging = true;
        while (continueMerging) {
            continueMerging = false;

            for (let i = 0; i < freshIngredientIdRanges.length; i++) {
                for (let j = i+1; j < freshIngredientIdRanges.length; j++) {
                    const range1 = freshIngredientIdRanges[i];
                    const range2 = freshIngredientIdRanges[j];

                    if (this.rangesOverlap(range1, range2)) {
                        // remove old ranges (higher index first)
                        freshIngredientIdRanges.splice(j, 1);
                        freshIngredientIdRanges.splice(i, 1);

                        // add combined range
                        const newRange = [
                            Math.min(range1[0], range2[0]),
                            Math.max(range1[1], range2[1]),
                        ];
                        freshIngredientIdRanges.push(newRange);

                        continueMerging = true;
                    }
                }
            }
        }

        return freshIngredientIdRanges.reduce((acc, curr) => acc + (curr[1] - curr[0] + 1), 0);
    }

    rangesOverlap(range1: number[], range2: number[]): boolean {
        const [from1,to1] = range1;
        const [from2,to2] = range2;

        return (
            (from1 <= from2 && from2 <= to1) || // range 1 encases start of range 2
            (from1 <= to2 && to2 <= to1) ||     // range 1 encases end of range 2
            (from2 <= from1 && from1 <= to2) || // range 2 encases start of range 1
            (from2 <= to1 && to1 <= to2)        // range 2 encases end of range 1
        );
    }



}

// noinspection JSUnusedGlobalSymbols
export default (new Y2025_Day05_2());