import AbstractRiddle from '../../src/JS/AbstractRiddle';

type Pattern = {
    x: 1 | 0 | -1;
    y: 1 | 0 | -1;
    char: string;
};

class Y2024_Day04_1 extends AbstractRiddle {

    riddle: string = "How many times does an X-MAS appear?";

    run(input: string[]): number {

        /*

         */
        const charsToSearch: Pattern[] = [
            {x:  0,  y:  0, char: 'A'},
            {x:  1,  y: -1, char: 'S'},
            {x: -1,  y: -1, char: 'S'},
            {x: -1,  y:  1, char: 'M'},
            {x:  1,  y:  1, char: 'M'},
        ];


        const inputChars = input.map(line => line.split(''));

        let counter = 0;

        for (let rotations = 0; rotations < 4; rotations++) {

            // rotate
            const rotatedPattern = this.rotatePattern(charsToSearch, rotations);

            for (let x = 1; x < inputChars.length - 1; x++) {
                for (let y = 1; y < inputChars[0].length - 1; y++) {
                    // check if all matches
                    if (rotatedPattern.every(pattern => {
                        const oY = y + pattern.y;
                        const oX = x + pattern.x;
                        if (!inputChars[oY] || !inputChars[oY][oX]) {
                            return false;
                        }
                        return inputChars[oY][oX] === pattern.char;
                    })) {
                        counter++;
                    }
                }
            }
        }

        return counter;
    }


    private rotatePattern(pattern: Pattern[], times: number): Pattern[] {
        const rotated: Pattern[] = [];
        for (let part of pattern) {
            let rotatedPart = part;
            for (let i = 0; i < times; i++) {
                rotatedPart = this.rotatePatternOnce(rotatedPart);
            }
            rotated.push(rotatedPart);
        }
        return rotated;
    }

    private rotatePatternOnce(pattern: Pattern): Pattern {
        switch (pattern.x * 10 + pattern.y) {
            case -11: // x = -1, y = -1
                return {x: -1, y: 1, char: pattern.char};
            case -9: // x = -1, y = 1
                return {x: 1, y: 1, char: pattern.char};
            case 11: // x = 1, y = 1
                return {x: 1, y: -1, char: pattern.char};
            case 9: // x = 1, y = -1
                return {x: -1, y: -1, char: pattern.char};
            case 0: // x = y = 0
            default:
                return pattern;
        }
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day04_1());