import AbstractRiddle from '../../src/JS/AbstractRiddle';

type Machine = {
    light_diagram: boolean[];
    wiring_schematics: number[][];
    joltage_requirements: number[];
};

class Y2025_Day10_1 extends AbstractRiddle {

    riddle: string = "What is the fewest button presses required to correctly configure the indicator lights on all of the machines?";

    run(input: string[]): number {

        const machines: Machine[] = input.map(this.parseInputLine.bind(this));

        let totalButtonPresses = 0;

        for(const machine of machines) {
            // As all switches toggle the same lights, every click after the first one would undo the previous.
            // This means, all switches are either pressed once or never. We can easily brute force over this.
            // Also: the equation is symmetrical. The same button presses to get the lights on, would turn them off

            // Keep in mind: We want to minimize the number of button presses:

            totalButtonPresses += this.bruteForce(
                machine.wiring_schematics,
                machine.light_diagram,
            );
        }

        return totalButtonPresses;
    }

    bruteForce(buttons: number[][], lights: boolean[], bIndex: number = 0, presses: number = 0): number {
        if (bIndex >= buttons.length) {
            // check if this solution is valid
            /*
            const ba2s = (bs: boolean[]): string => {
                return bs.map(b => b ? '1':'0').join('');
            }
            console.log(`Checking: ${ba2s(lights)} == ${ba2s(presses)}`);
            */
            const isValid = lights.every((light) => !light);
            return isValid ? presses : Infinity;
        }


        const noFlick = this.bruteForce(buttons, lights, bIndex+1, presses);
        const nextLights = [...lights];
        for (const j of buttons[bIndex]) {
            nextLights[j] = !nextLights[j];
        }
        const flick = this.bruteForce(buttons, nextLights, bIndex+1, presses+1);

        return Math.min(noFlick, flick);
    }


    parseInputLine(line: string): Machine {
        const stringToInt = (d: string) => parseInt(d);

        const rgx = /^\[(.+)] (\(.+\)) \{(.*)}/;
        const match = rgx.exec(line);
        this.assert(match.length >= 4, "Line has to be a valid machine")
        const [_,ld,ws,jr] = match;
        return {
            light_diagram: ld.split('').map(c => c === '#'),
            wiring_schematics: ws.split(' ').map(part => {
                const nums = part.substring(1, part.length - 1);
                return nums.split(',').map(stringToInt);
            }),
            joltage_requirements: jr.split(',').map(stringToInt)
        };
    }


}

// noinspection JSUnusedGlobalSymbols
export default (new Y2025_Day10_1());