import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector from "../../src/JS/Geometry/Vector";

const A = 0;
const B = 1;
const C = 2;

class Y2024_Day17_1 extends AbstractRiddle {

    riddle: string = "what do you get if you use commas to join the values it output into a single string?";

    run(input: string[]): string {


        const registers: [number,number,number] = [
            parseInt(input[0].slice("Register A: ".length)),
            parseInt(input[1].slice("Register B: ".length)),
            parseInt(input[2].slice("Register C: ".length)),
        ];

        const programm = input[4].slice("Program: ".length).split(',').map(o => parseInt(o));

        const debug = false;

        let instructionPointer = 0;
        const output: number[] = [];

        while (instructionPointer < programm.length+1) {
            const opCode = programm[instructionPointer];
            const operand = programm[instructionPointer+1];

            const operandValue = (operand & 0b100) ? registers[operand & 0b11] : operand;

            switch (opCode) {
                case 0: // adv -> division with A register as denominator
                    registers[A] = Math.floor(registers[A] / Math.pow(2, operandValue));
                    if (debug) console.log('adv: ', registers);
                    break;
                case 1: // bxl -> bitwitse xor of register B with literal operand
                    registers[B] = Math.floor(registers[B] ^ operand);
                    if (debug) console.log('bxl: ', registers);
                    break;
                case 2: // bst -> set B register to operand mod 8
                    registers[B] = Math.floor(operandValue & 0b111);
                    if (debug) console.log('bst: ', registers);
                    break;
                case 3: // jnz -> jump to operand if A register is non zero
                    if (registers[A]) {
                        instructionPointer = operand-2;
                    }
                    if (debug) console.log('jnz: ', !!registers[A]);
                    break;
                case 4: // bxc -> store B Register XOR C Register into B Register (ignore the operand)
                    registers[B] = registers[B] ^ registers[C];
                    if (debug) console.log('bxc: ', registers);
                    break;
                case 5: // out -> output the value mod 8 of the operandValue
                    output.push(operandValue & 0b111);
                    if (debug) console.log(`out: ${operandValue} -> `, output);
                    break;
                case 6: // bdv -> division with A register as denominator and write to B
                    registers[B] = Math.floor(registers[A] / Math.pow(2, operandValue));
                    if (debug) console.log('bdv: ', registers);
                    break;
                case 7: // cdv -> division with A register as denominator and write to C
                    registers[C] = Math.floor(registers[A] / Math.pow(2, operandValue));
                    if (debug) console.log('cdv: ', registers);
                    break;
            }

            instructionPointer += 2;
        }

        return output.join(',');
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day17_1());