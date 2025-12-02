import AbstractRiddle from '../../src/JS/AbstractRiddle';

class Y2025_Day01_2 extends AbstractRiddle {

    riddle: string = "What's the actual password to open the door?";

    run(input: string[]): number {

        let totalZeros = 0;
        let currentVal = 50;

        for(const line of input) {
            const dir = line.charAt(0) === 'L' ? -1 : 1;
            const num = parseInt(line.substring(1));
            const last = currentVal;

            // count full circles
            let zeros = Math.floor(num / 100);
            const remainderNum = num % 100;

            // if we have a remainder
            if (remainderNum !== 0) {
                currentVal += dir * remainderNum;

                // check if the remainder crossed (not started on) zero
                if (last !== 0 && (currentVal <= 0 || currentVal >= 100)) zeros++;

                currentVal = currentVal % 100;
                while (currentVal < 0) currentVal += 100;
            }

            totalZeros += zeros;
        }

        return totalZeros;
    }
}

// noinspection JSUnusedGlobalSymbols
export default (new Y2025_Day01_2());