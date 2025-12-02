import AbstractRiddle from '../../src/JS/AbstractRiddle';

class Y2025_Day01_1 extends AbstractRiddle {

    riddle: string = "What's the actual password to open the door?";

    run(input: string[]): number {

        let totalZeros = 0;
        let currentVal = 50;

        for (const line of input) {
            const dir = line.charAt(0) === 'L' ? -1 : 1;
            const num = parseInt(line.substring(1)) % 100;

            currentVal = (currentVal + dir * num) % 100;

            currentVal = currentVal % 100;
            while (currentVal < 0) currentVal += 100;

            if (currentVal === 0) {
                totalZeros++
            }
        }

        return totalZeros;
    }
}

// noinspection JSUnusedGlobalSymbols
export default (new Y2025_Day01_1());