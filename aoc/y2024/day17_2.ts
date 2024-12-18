import AbstractRiddle from '../../src/JS/AbstractRiddle';


class Y2024_Day17_2 extends AbstractRiddle {

    riddle: string = "What is the lowest positive initial value for register A that causes the program to output a copy of itself?";

    run(input: string[]): bigint {

        const program = input[4].slice("Program: ".length).split(',').map(o => parseInt(o));


        this.assert(program.length % 2 === 0, "Program has an even length");
        this.assert(
            program.every((op, i): boolean => {
                return (i%2 !== 0) || (op !== 3) || (program[i+1]%2 === 0)
            }),
            "Every jump will keep the pointer at an even index (not shifting opCodes and operands)"
        );
        this.assert(
            program[program.length-2] === 3 &&
            program[program.length-1] === 0,
            "The last instruction jumps back to the start"
        );
        this.assert(
            program.every((op, i): boolean => {
                return (i%2 !== 0) || !(op === 0 && program[i+1] === 0b100)
            }),
            "The A register is never divided by itself (making all values for A possible predecessors)"
        );


        /*
        program:
            2,4 -> B = A % 8
            1,1 -> B = B ^ 1
            7,5 -> C = A / pow(2,B)
            4,4 -> B = B ^ C
            1,4 -> B = B ^ 4
            0,3 -> A = A / pow(2, 3) = A / 8
            5,5 -> out( B % 8 )
            3,0 -> if A != 0 then jmp 0


        Simplified instructions
            while (A != 0) {
                B = (A & 0b111) ^ 1
                C = A / pow(2,B)
                B = (B ^ C) ^ 4
                A = A << 3
                out( B & 0b111 )
            }

         Discoveries:
            - A is always a multiple of 8
            - the loop runs, until A is zero
            - The initial values of B and C don't matter (they are overwritten immediately)
            - B and C can be completely removed from the calculation
            - the only loop back goes from the end to the start


        */

        let possibleAs = [0,1,2,3,4,5,6,7].map(n => BigInt(n));
        for (const output of program.reverse().map(p => BigInt(p))) {

            let nextPossibleAs: bigint[] = [];

            for (const A of possibleAs) {

                if (!this.runCheck(output, A)) {
                    continue;
                }

                for (let lowerBits = BigInt(0b000); lowerBits <= 0b111; lowerBits++) {
                    nextPossibleAs.push((A << 3n) + lowerBits);
                }

            }

            possibleAs = nextPossibleAs;
        }

        const smallestA = possibleAs.sort();

        return smallestA[0] >> 3n;
    }


    private runCheck(output: bigint, A: bigint): boolean {
        let B: bigint, C: bigint;

        const lowerBits = A & BigInt(0b111);

        B = lowerBits ^ 1n;
        C = A / (2n ** B);
        B = B ^ C;
        B = B ^ 4n

        // console.log(`> Check for ${output} with A ${A} results in ${B & BigInt(0b111)}`);
        return output === (B & BigInt(0b111));
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day17_2());