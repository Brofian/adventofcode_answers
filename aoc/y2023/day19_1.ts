import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector from '../../src/JS/Vector';

type ValidOperator = '>'|'<';

type DataSet = {
    [key: string]: number
};

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

class Y2023_Day19_1 extends AbstractRiddle {

    riddle: string = "What is the sum of the attributes of all accepted items?";

    data: DataSet[] = [];
    instructions: InstructionSet = {};

    run(): number {
        const instructionRegex = /(\D+)\{((?:\D[<,>]\d+:\D+,)*)(\D+)}/;
        const conditionRegex  = /(\D)([<,>])(\d+):(\D+)/;

        let reachedData = false;
        this.readInput().map(line => {
            if (!reachedData) {
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
            }
            else {
                // interpret line as data
                this.data.push(
                    JSON.parse(line.replace(/=/g, '":').replace(/([,{])/g, '$1"')) as DataSet
                );
            }
        });


        let totalOfAcceptedItems = 0;
        for (const item of this.data) {

            let currentWorkflow = 'in';
            while (currentWorkflow !== 'A' && currentWorkflow !== 'R') {

                const workflow = this.instructions[currentWorkflow];
                let nextWorkflow = workflow.fallback;

                for (const condition of workflow.conditions) {
                    if (this.checkCondition(condition, item)) {
                        nextWorkflow = condition.nextInstruction;
                        break;
                    }
                }

                currentWorkflow = nextWorkflow;
            }


            if (currentWorkflow === 'A') {
                totalOfAcceptedItems += (
                    item["a"] +
                    item["x"] +
                    item["s"] +
                    item["m"]
                );
            }
        }

        return totalOfAcceptedItems;
    }


    protected checkCondition(cond: Condition, item: DataSet): boolean {

        switch (cond.operator) {
            case ">":
                return item[cond.property] > cond.value;
            case "<":
                return item[cond.property] < cond.value;
        }
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2023_Day19_1());