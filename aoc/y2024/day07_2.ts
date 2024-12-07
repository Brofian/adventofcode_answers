import AbstractRiddle from '../../src/JS/AbstractRiddle';

type TestCase = {
    testValue: number;
    operands: number[];
}

type Operator = {(a: number, b: number): number};


class Y2024_Day07_2 extends AbstractRiddle {

    riddle: string = "What is their total calibration result?";

    operators: Operator[] = [
        (a,b) => a+b,
        (a,b) => a*b,
        (a,b) => parseInt(a + '' + b),
    ];


    run(input: string[]): number {

        const cases: TestCase[] = input.map(line => {
            const regex = /^(\d+): (.*)$/;
            const m = line.match(regex);
            this.assert(m !== null);

            return {
                testValue: parseInt(m[1]),
                operands: m[2].split(' ').map(s => parseInt(s))
            };
        });


        return cases.reduce((carry, testCase) => {
            if (this.checkTestCase(testCase)) {
                return carry + testCase.testValue;
            }
            return carry;
        }, 0);
    }


    checkTestCase(testCase: TestCase): boolean {
        // the list of values we could have reached by now
        let intermResults: number[] = [testCase.operands[0]];

        // for every number of the test case
        for (let i = 1; i < testCase.operands.length; i++) {
            const nextOperant = testCase.operands[i];

            // for every possible intermedite result, we have calculated before
            const nextIntermResults: number[] = [];
            for (const intermResult of intermResults) {

                // apply all the operators and save the results
                for (const op of this.operators) {
                    const result = op(intermResult, nextOperant);
                    if (!nextIntermResults.includes(result) && result <= testCase.testValue) {
                        nextIntermResults.push(result);
                    }
                }

            }

            intermResults = nextIntermResults;
            if (intermResults.length === 0) {
                return false; // no possibilities left
            }
        }

        return intermResults.includes(testCase.testValue);
    }


}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day07_2());