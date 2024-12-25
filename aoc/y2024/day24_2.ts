import AbstractRiddle from '../../src/JS/AbstractRiddle';

type GateType = 'AND' | 'OR' | 'XOR';

const GateLogic: { [key in GateType]: { (a: boolean, b: boolean): boolean } } = {
    'AND': (a: boolean, b: boolean) => a && b,
    'OR': (a: boolean, b: boolean) => a || b,
    'XOR': (a: boolean, b: boolean) => a !== b,
}

type Gate = {
    a: string,
    b: string,
    c: string,
    type: GateType,
    output?: boolean,
};

type BitError = {
    position: number;
    zKey: string;
    wrongValue: boolean;
}

class Y2024_Day24_1 extends AbstractRiddle {

    riddle: string = "what do you get if you sort the names of the eight wires involved in a swap and then join those names with commas?";

    wires: { [key: string]: boolean } = {};
    gates: { [key: string]: Gate } = {};

    expectedZ: bigint;

    run(input: string[]): string | number | bigint {

        this.readGatesAndWires(input);
        this.determineExpectedZ();

        /*
         *  The values to switch are determined by looking at the generated dot graph
         */
        const switches: [string,string][] = [
            ['z10', 'gpr'],
            ['z21', 'nks'],
            ['z33', 'ghp'],
            ['krs', 'cpm'],
        ]

        // resolve switches
        for (const [outKeyA, outKeyB] of switches) {
            const gateA = this.gates[outKeyA];
            const gateB = this.gates[outKeyB];
            // switch outputs
            const tmp = gateA.c;
            gateA.c = gateB.c;
            gateB.c = tmp;
            // switch positions in object
            this.gates[outKeyA] = gateB;
            this.gates[outKeyB] = gateA;
        }


        this.solve([...Object.values(this.gates)]); // simulate and add the outputs to the gates
        const wrongBits = this.determineWrongBits();

        if (wrongBits.length) {
            this.dump(`> found ${wrongBits.length} wrong bits`);
            this.dd(this.generateDotGraph(wrongBits));
        }

        const switchedWires: Set<string> = new Set<string>([...switches.flat()]);

        return [...switchedWires].sort().join(',');
    }

    private determineWrongBits(): BitError[] {
        const wrongBits: BitError[] = [];
        for (const entry of Object.entries(this.gates)) {
            if (!entry[0].startsWith('z')) {
                continue;
            }
            const bitPosition = parseInt(entry[0].substring(1));
            const bitValue = entry[1].output;

            if (bitValue !== (this.expectedZ & BigInt(Math.pow(2, bitPosition))) > 0) {
                // wrong bit
                wrongBits.push({
                    position: bitPosition,
                    wrongValue: bitValue,
                    zKey: 'z'+bitPosition.toString().padStart(2, '0')
                })
            }
        }
        return wrongBits;
    }

    private generateDotGraph(wrongBits: BitError[]): string {
        const dotGraph: string[] = [];

        for (const [wireKey, _] of Object.entries(this.wires)) {
            dotGraph.push(`${wireKey} [shape=Mdiamond];`);
        }

        for (const gate of Object.values(this.gates)) {
            if (wrongBits.find(wrongBit => wrongBit.zKey === gate.c) !== undefined) {
                dotGraph.push(`${gate.c} [style="filled", fillcolor="red", label="${gate.type} : \\N"]`);
            }
            else {
                dotGraph.push(`${gate.c} [label="${gate.type} : \\N"]`);
            }

            dotGraph.push(`${gate.a} -> ${gate.c}`);
            dotGraph.push(`${gate.b} -> ${gate.c}`);
        }

        return dotGraph.join('\n');
    }


    /**
     * Run an iteration of the simulation to validate the result. Returns true, if the current state
     * of gates would produce the expected Z output
     *
     * @param gates
     * @private
     */
    private solve(gates: Gate[]): boolean {
        const wirePool: typeof this.wires = {...this.wires};
        while (gates.length) {
            let hasChanged = false;
            for (const gate of gates) {
                const parentA = wirePool[gate.a];
                const parentB = wirePool[gate.b];

                if (parentA === undefined || parentB === undefined) {
                    continue;
                }
                hasChanged = true;

                const output = GateLogic[gate.type](parentA, parentB);
                wirePool[gate.c] = output;
                gate.output = output;
                gates.splice(gates.indexOf(gate), 1);
            }

            if (!hasChanged) {
                return false;
            }
        }

        const zBinary = Object.entries(wirePool)
            .filter(entry => entry[0].startsWith('z'))
            .sort((a, b) => a[0] > b[0] ? -1 : 0)
            .join('');

        const z = parseInt(zBinary, 2);

        return !Number.isNaN(z) && BigInt(z) === this.expectedZ;
    }


    /**
     * Use the default x.. and y.. wires to calculate the expected output value z (x+y)
     * @private
     */
    private determineExpectedZ(): void {

        const xBinary = Object.entries(this.wires).filter(entry => entry[0].startsWith('x'))
            .sort((a, b) => a[0] > b[0] ? -1 : 0)
            .map(entry => entry[1] ? 1 : 0).join('');
        const yBinary = Object.entries(this.wires).filter(entry => entry[0].startsWith('y'))
            .sort((a, b) => a[0] > b[0] ? -1 : 0)
            .map(entry => entry[1] ? 1 : 0).join('');

        this.expectedZ = BigInt(parseInt(xBinary, 2) + parseInt(yBinary, 2));

    }


    /**
     * Interpret the input to get a list of wires (the x.. and y.. values)
     * and a list of gates and their types. Each gate being named after the output they produce
     *
     * @param input
     * @private
     */
    private readGatesAndWires(input: string[]): void {
        let readingGates = false;
        input.forEach((line, index) => {
            if (line === '') {
                readingGates = true;
                return;
            } else if (readingGates) {
                const m = line.match(/^(.+) ((AND)|(OR)|(XOR)) (.+) -> (.+)$/);
                this.assert(!!m, `Line ${index} matches gate pattern`);

                this.gates[m[7]] = {
                    a: m[1],
                    b: m[6],
                    c: m[7],
                    type: m[2] as GateType,
                };
            } else {
                const m = line.match(/^(.\d+): ([10])$/);
                this.assert(!!m, `Line ${index} matches wire pattern`);
                this.wires[m[1]] = m[2] === '1';
            }
        })
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day24_1());