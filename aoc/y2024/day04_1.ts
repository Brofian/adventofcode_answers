import AbstractRiddle from '../../src/JS/AbstractRiddle';

class Y2024_Day04_1 extends AbstractRiddle {

    riddle: string = "How many times does XMAS appear?";

    run(input: string[]): number {

        const inputChars = input.map(line => line.split(''));

        let counter = 0;

        // left to right
        counter += input.reduce((carry, line) => {
            return carry + (line.match(/XMAS/g)||[]).length
        }, 0);

        const mirroredInput = input.map(line => line.split('').reverse().join(''));
        // right to left
        counter += mirroredInput.reduce((carry, line) => {
            return carry + (line.match(/XMAS/g)||[]).length
        }, 0);

        const rotateLeftInput = this.transpose2DArray(inputChars).map(chars => chars.join(''));
        // top to bottom
        counter += rotateLeftInput.reduce((carry, line) => {
            return carry + (line.match(/XMAS/g)||[]).length
        }, 0);

        const rotateRightInput = rotateLeftInput.map(line => line.split('').reverse().join(''));
        // bottom to top
        counter += rotateRightInput.reduce((carry, line) => {
            return carry + (line.match(/XMAS/g)||[]).length
        }, 0);


        //create diagonal lines
        this.assert(inputChars.every(line => line.length === inputChars[0].length), 'Rectangular input');
        const diagonals = this.createMappedArray(inputChars.length + inputChars[0].length - 1, (): string[] => []);
        const reverseDiagonals = this.createMappedArray(inputChars.length + inputChars[0].length - 1, (): string[] => []);
        for (let y = 0; y < inputChars.length; y++) {
            for (let x = 0; x < inputChars[y].length && y+x < inputChars.length; x++) {
                diagonals[y].push(inputChars[y+x][x]);
                reverseDiagonals[y].push(inputChars[y+x][inputChars[0].length - 1 - x]);
            }
        }
        for (let x = 1; x < inputChars[0].length; x++) {
            for (let y = 0; y < inputChars.length && x+y < inputChars[0].length; y++) {
                diagonals[inputChars.length + x - 1].push(inputChars[y][x+y]);
                reverseDiagonals[inputChars.length + x - 1].push(inputChars[y][inputChars[0].length - 1 - x - y]);
            }
        }


        // top left to bottom right
        const diagonalLines = diagonals.map(line => line.join(''));
        counter += diagonalLines.reduce((carry, line) => {
            return carry + (line.match(/XMAS/g)||[]).length
        }, 0);


        // bottom right to top left
        const mirroredDiagonalLines = diagonalLines.map(line => line.split('').reverse().join(''));
        counter += mirroredDiagonalLines.reduce((carry, line) => {
            return carry + (line.match(/XMAS/g)||[]).length
        }, 0);

        // top right to bottom left
        const reversedDiagonalLines = reverseDiagonals.map(line => line.join(''));
        counter += reversedDiagonalLines.reduce((carry, line) => {
            return carry + (line.match(/XMAS/g)||[]).length
        }, 0);


        // bottom left to top right
        const reversedMirroredDiagonalLines = reversedDiagonalLines.map(line => line.split('').reverse().join(''));
        counter += reversedMirroredDiagonalLines.reduce((carry, line) => {
            return carry + (line.match(/XMAS/g)||[]).length
        }, 0);

        return counter;
    }



}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day04_1());