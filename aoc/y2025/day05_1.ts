import AbstractRiddle from '../../src/JS/AbstractRiddle';


class  Y2025_Day05_1 extends AbstractRiddle {

    riddle: string = "How many of the available ingredient IDs are fresh?";

    run(input: string[]): number {

        const freshIngredientIdRanges: number[][] = [];
        const availableIngredientIds: number[] = [];
        let reachedIngredients = false;
        input.forEach(line => {
            if (line === '') {
                reachedIngredients = true;
            }
            else if (!reachedIngredients) {
                const range = line.split('-').map(n => parseInt(n));
                freshIngredientIdRanges.push(range);
            }
            else {
                availableIngredientIds.push(parseInt(line));
            }
        })


        let numAvailableFreshIngredients = 0;
        for (const id of availableIngredientIds) {
            for (const [from, to] of freshIngredientIdRanges) {
                if (from <= id && id <= to) {
                    numAvailableFreshIngredients++;
                    break;
                }
            }
        }

        return numAvailableFreshIngredients;
    }



}

// noinspection JSUnusedGlobalSymbols
export default (new Y2025_Day05_1());