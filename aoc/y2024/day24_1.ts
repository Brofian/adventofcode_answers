import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector from "../../src/JS/Geometry/Vector";

type GateType = 'AND'|'OR'|'XOR';

const GateLogic: {[key in GateType]: {(a: boolean, b: boolean): boolean}} = {
    'AND': (a: boolean,b: boolean) => a && b,
    'OR':  (a: boolean,b: boolean) => a || b,
    'XOR': (a: boolean,b: boolean) => a !== b,
}

class Y2024_Day24_1 extends AbstractRiddle {

    riddle: string = "What decimal number does it output on the wires starting with z?";

    run(input: string[]): string | number | bigint {

        const wires: {[key: string]: boolean} = {};
        const gates: {a: string, b: string, c: string, type: GateType}[] = [];

        let readingGates = false;
        input.forEach((line, index) => {
            if (line === '') {
                readingGates = true;
                return;
            }
            else if (readingGates) {
                const m = line.match(/^(.+) ((AND)|(OR)|(XOR)) (.+) -> (.+)$/);
                this.assert(!!m, `Line ${index} matches pattern`);
                gates.push({
                    a: m[1],
                    b: m[6],
                    c: m[7],
                    type: m[2] as GateType,
                });
            }
            else {
                const m = line.match(/^(.+): ([10])$/);
                this.assert(!!m, `Line ${index} matches pattern`);
                wires[m[1]] = m[2] === '1';
            }
        })


        while (gates.length) {

            for (const gate of gates) {

                const aValue = wires[gate.a];
                const bValue = wires[gate.b];
                if (aValue === undefined || bValue === undefined) {
                    continue;
                }

                const logic = GateLogic[gate.type];
                wires[gate.c] = logic(aValue, bValue);
                gates.splice(gates.indexOf(gate), 1);
            }
        }


        const zValues = Object.entries(wires).filter(entry => entry[0].startsWith('z'));
        zValues.sort((entryA, entryB) => entryA[0] > entryB[0] ? -1 : 1);

        const binarySolution = zValues.map(entry => entry[1] ? '1' : '0').join('');

        // this.dd(zValues);

        return parseInt(binarySolution, 2);
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day24_1());