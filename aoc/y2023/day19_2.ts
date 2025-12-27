import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector from '../../src/JS/Geometry/Vector';

type ValidOperator = '>'|'<';

type Condition = {
  property: string,
  operator: ValidOperator;
  value: number,
  nextInstruction: string;
};

type Instruction = {
    conditions: Condition[],
    fallback: string;
};

type InstructionSet = {[key: string]: Instruction};


type Range = {
    from: number,
    to: number
} | null;

type Item = {[key: string]: Range}

class Y2023_Day19_2 extends AbstractRiddle {

    riddle: string = "How many possible items are there, if any attribute can have a value between one and 4000?";

    instructions: InstructionSet = {};

    run(): number {
        const instructionRegex = /(\D+)\{((?:\D[<,>]\d+:\D+,)*)(\D+)}/;
        const conditionRegex  = /(\D)([<,>])(\d+):(\D+)/;

        let reachedData = false;
        this.readInput().map(line => {
            if (reachedData) {
                return;
            }
            if(line === '') {
                reachedData = true;
                return;
            }

            // interpret line as instruction step
            const lineMatch = instructionRegex.exec(line);
            const key = lineMatch[1];
            const rules = lineMatch[2].slice(0,-1); // removing trailing comma
            const fallback = lineMatch[3];

            const conditions: Condition[] = [];
            for (const rule of rules.split(',')) {
                const ruleMatch = conditionRegex.exec(rule);
                conditions.push({
                    property: ruleMatch[1],
                    operator: ruleMatch[2] as ValidOperator,
                    value:    parseInt(ruleMatch[3]),
                    nextInstruction: ruleMatch[4],
                });
            }

            this.instructions[key] = {
                conditions: conditions,
                fallback: fallback
            };
        });


        const acceptedRanges: Item[] = this.calculateAcceptedRanges('in', {
            x: {from: 1, to: 4000},
            m: {from: 1, to: 4000},
            a: {from: 1, to: 4000},
            s: {from: 1, to: 4000},
        });


        // multiply accepted ranges
        let numAcceptedValues = 0;
        for (const acceptedRange of acceptedRanges) {
            numAcceptedValues += (
                this.rangeToValue(acceptedRange.x) *
                this.rangeToValue(acceptedRange.m) *
                this.rangeToValue(acceptedRange.a) *
                this.rangeToValue(acceptedRange.s)
            );
        }


        return numAcceptedValues;
    }

    protected calculateAcceptedRanges(workflowKey: string, startRanges: Item): Item[] {
        if (workflowKey === 'R' || this.isEmptyItem(startRanges)) {
            return [{
                x: null,
                m: null,
                a: null,
                s: null,
            }];
        }

        if (workflowKey === 'A') {
            return [startRanges];
        }


        const workflow = this.instructions[workflowKey];
        let partialItems: Item[] = [];

        for (const condition of workflow.conditions) {
            const propRange: Range = startRanges[condition.property];
            if (propRange === null) {
                // none of the options would pass this test
                continue;
            }

            if (condition.operator === '<') {

                if (propRange.to < condition.value) {
                    // our full range is affected
                    partialItems.push(...this.calculateAcceptedRanges(condition.nextInstruction, this.copyItem(startRanges)));
                    startRanges.s = null;
                    startRanges.x = null;
                    startRanges.a = null;
                    startRanges.m = null;
                    break;
                }
                else if (propRange.from < condition.value && propRange.to >= condition.value) {
                    // check matching range
                    const matchingPartialItem = this.copyItem(startRanges);
                    matchingPartialItem[condition.property] = {from: propRange.from, to: condition.value - 1};
                    partialItems.push(...this.calculateAcceptedRanges(condition.nextInstruction, matchingPartialItem));

                    // continue with not matching range
                    startRanges[condition.property] = {from: condition.value, to: propRange.to};
                }

                // if we do not match at all, check the other conditions with the full range
            }
            else { // condition.operator === '>'

                if (propRange.from > condition.value) {
                    // our full range is affected
                    partialItems.push(...this.calculateAcceptedRanges(condition.nextInstruction, this.copyItem(startRanges)));
                    startRanges.x = null;
                    startRanges.m = null;
                    startRanges.a = null;
                    startRanges.s = null;
                    break;
                }
                else if (propRange.from <= condition.value && propRange.to > condition.value) {
                    // check matching range
                    const matchingPartialItem = this.copyItem(startRanges);
                    matchingPartialItem[condition.property] = {from: condition.value+1, to: propRange.to};
                    partialItems.push(...this.calculateAcceptedRanges(condition.nextInstruction, matchingPartialItem));

                    // continue with not matching range
                    startRanges[condition.property] = {from: propRange.from, to: condition.value};
                }

                // if we do not match at all, check the other conditions with the full range

            }
        }
        partialItems.push(...this.calculateAcceptedRanges(workflow.fallback, startRanges));


        return partialItems.filter(el => !this.isEmptyItem(el));
    }

    copyItem(i: Item): Item {
        return {
            x: i.x === null ? null : {from: i.x.from, to: i.x.to},
            m: i.m === null ? null : {from: i.m.from, to: i.m.to},
            a: i.a === null ? null : {from: i.a.from, to: i.a.to},
            s: i.s === null ? null : {from: i.s.from, to: i.s.to},
        }
    }

    isEmptyItem(i: Item): boolean {
        return (i.m === null) && (i.a === null) && (i.x === null) && (i.s === null);
    }

    rangeToValue(r: Range): number {
        if (r === null) return 1;

        return r.to - r.from + 1;
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2023_Day19_2());