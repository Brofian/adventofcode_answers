import AbstractRiddle from '../../src/JS/AbstractRiddle';


enum Operation {
    SET,
    REMOVE
}

type Lens = {
    strength: number,
    label: string,
};

type Instruction = {
    hash: number,
    label: string,
    operation: Operation,
    lens?: number
};

class Y2023_Day15_2 extends AbstractRiddle {

    riddle: string = "What is the combined focal power after implementing the lenses according to the instructions?";

    boxes: Lens[][] = [...Array(256)].map((_): Lens[] => []);

    run(): number {
        const regex = /(\D+)(=|-)(\d*)/;
        const sequence: Instruction[] = this.readInput()[0].trim().split(',').map(el => {
            const matches = regex.exec(el);
            return {
                hash: this.asciiStringHelperAlgorithm(matches[1]),
                label: matches[1],
                operation: matches[2] === '=' ? Operation.SET : Operation.REMOVE,
                lens: matches[2] === '=' ? parseInt(matches[3]) : undefined,
            }
        });

        for (const instruction of sequence) {

            const existingLens = this.boxes[instruction.hash].filter(el => el.label === instruction.label);

            if (instruction.operation === Operation.REMOVE) {

                // index of the lens or -1 if none found
                if (existingLens.length > 0) {
                    // remove the lens from the box and move every other lens forward
                    const index = this.boxes[instruction.hash].indexOf(existingLens[0]);
                    this.boxes[instruction.hash].splice(index, 1);
                }

            }
            else {

                if (existingLens.length > 0) {
                    // replace the lens
                    const index = this.boxes[instruction.hash].indexOf(existingLens[0]);
                    this.boxes[instruction.hash][index].strength = instruction.lens;
                }
                else {
                    this.boxes[instruction.hash].push({
                        label: instruction.label,
                        strength: instruction.lens
                    });
                }

            }
        }

        let focusingPower = 0;
        for (let boxIndex = 0; boxIndex < this.boxes.length; boxIndex++) {
            const box = this.boxes[boxIndex];

            for (let lensIndex = 0; lensIndex < box.length; lensIndex++) {
                const lens = box[lensIndex];

                focusingPower += (1 + boxIndex) * (lensIndex+1) * lens.strength;
            }
        }


        return focusingPower;
    }

    protected asciiStringHelperAlgorithm(str: string): number {
        let currentValue = 0;

        for (const char of str) {
            currentValue += char.charCodeAt(0);
            currentValue *= 17;
            currentValue %= 256;
        }

        return currentValue;
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2023_Day15_2());