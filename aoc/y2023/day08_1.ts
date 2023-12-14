import AbstractRiddle from '../../src/JS/AbstractRiddle';


class Y2023_Day08_1 extends AbstractRiddle {

    riddle: string = "How many steps do you need from AAA to ZZZ by following the instructions?";

    mapIndex: {[key: string]: number} = {};

    run(): number {
        const input: string[] = this.readInput().filter(el => el !== "");

        const instructions: string[] = input.shift().split('');
        //const regex = /([A-Z]+) = \(([A-Z]+), ([A-Z]+)\)/gm;
        const regex = /[A-Z]+/gm;

        const maps: string[][] = input.map((line, index) => {
            const matches = [];
            let match: any[];
            while (match = regex.exec(line.trim())) {
                matches.push(match[0]);
            }

            this.mapIndex[matches[0]] = index;

            return [matches[1], matches[2]];
        });


        let currentNode = 'AAA';
        let instructionIndex = 0;
        let steps = 0;

        while (currentNode !== 'ZZZ') {
            const options = maps[this.mapIndex[currentNode]];
            const currentInstruction = instructions[instructionIndex];
            currentNode = options[currentInstruction === 'L' ? 0 : 1]


            instructionIndex++;
            instructionIndex %= instructions.length;
            steps++;
        }


        return steps;
    }


}

// noinspection JSUnusedGlobalSymbols
export default (new Y2023_Day08_1());