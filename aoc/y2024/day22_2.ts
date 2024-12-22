import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector from "../../src/JS/Vector";




class Y2024_Day22_1 extends AbstractRiddle {

    riddle: string = "What is the most bananas you can get?";

    run(input: string[]): string | number | bigint {

        const secretNumbers = input.map(line => BigInt(parseInt(line)));

        const changeScorings: {[key: string]: bigint[]} = {};

        for (let s = 0; s < secretNumbers.length; s++) {
            let secret = secretNumbers[s];

            const init = secret % 10n;
            const changes: [bigint,bigint,bigint,bigint] = [init,init,init,init];
            const encounteredChangesSet = new Set<string>();

            let lastPrice = init;
            for (let i = 0; i < 2000; i++) {
                const newSecret = this.evolveSecret(secret);
                const newPrice = newSecret % 10n;

                changes[0] = changes[1];
                changes[1] = changes[2];
                changes[2] = changes[3];
                changes[3] = (newPrice - lastPrice);
                lastPrice = newPrice;

                const changeKey = changes.join('|')
                // check if we have encountered these changes before. If we do, we cannot use the second occurrence
                if (!encounteredChangesSet.has(changeKey) && i >= 3) {
                    encounteredChangesSet.add(changeKey);

                    if (!changeScorings[changeKey]) {
                        changeScorings[changeKey] = [newPrice];
                    }
                    else {
                        changeScorings[changeKey].push(newPrice)
                    }
                }

                secret = newSecret;
            }
        }


        const bestProfit = Object.values(changeScorings).map(
            scoring => scoring.reduce((a, b) => a + b)
        ).reduce((a, b) => (a > b) ? a : b);


        return bestProfit;
    }

    private evolveSecret(secret: bigint): bigint {

        const m1 = secret << 6n; // secret * 64n
        secret = secret ^ m1; // mix
        secret = secret & 16777215n; // prune

        const d1 = secret >> 5n; // secret / 32n
        secret = secret ^ d1; // mix
        secret = secret & 16777215n; // prune

        const m2 = secret << 11n; // secret * 2048n
        secret = secret ^ m2; // mix
        secret = secret & 16777215n; // prune

        return secret;
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day22_1());