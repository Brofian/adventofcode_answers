import AbstractRiddle from '../../src/JS/AbstractRiddle';


class Y2023_Day08_2 extends AbstractRiddle {

    riddle: string = "How many steps do you need from AAA to ZZZ by following the instructions?";

    mapIndex: {[key: string]: number} = {};

    run(): number {
        const input: string[] = this.readInput().filter(el => el !== "");

        const instructions: string[] = input.shift().split('');
        //const regex = /([A-Z]+) = \(([A-Z]+), ([A-Z]+)\)/gm;
        const regex = /[A-Z0-9]+/gm;

        let currentNodes: {
            name: string,
            steps: number
        }[] = [];

        const maps: string[][] = input.map((line, index) => {
            const matches = [];
            let match: any[];
            while (match = regex.exec(line.trim())) {
                matches.push(match[0].trim());
            }

            this.mapIndex[matches[0]] = index;
            if (matches[0].substring(2,3) === 'A') {
                currentNodes.push({
                    name: matches[0],
                    steps: -1
                });
            }

            return [matches[1], matches[2]];
        });

        let instructionIndex = 0;
        let steps = 0;

        while (true) {
            steps++;
            const currentInstruction = instructions[instructionIndex] === 'L' ? 0 : 1;

            const remainingNodes = currentNodes.filter(node => node.steps === -1);
            if (remainingNodes.length === 0) {
                break;
            }

            for (const node of remainingNodes) {
                const options = maps[this.mapIndex[node.name]];
                node.name = options[currentInstruction]

                if (node.name.substring(2,3) === 'Z') {
                    node.steps = steps;
                }
            }

            instructionIndex++;
            instructionIndex %= instructions.length;
        }




        return this.lcm(...currentNodes.map(c => c.steps));
    }

    lcm(...numbers: number[]) {
        return numbers.reduce((a, b) => a * b / this.gcd(a, b));
    }

    gcd(a: number, b: number): number {
        if (b === 0) return a;
        return this.gcd(b, a % b);
    };

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2023_Day08_2());