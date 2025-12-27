import AbstractRiddle from '../../src/JS/AbstractRiddle';


type Device = {
    key: string;
    targets: string[];
}

class Y2025_Day11_1 extends AbstractRiddle {

    riddle: string = "How many different paths lead from you to out?";

    deviceIndex: {[key: string]: Device} = {};

    run(input: string[]): number {
        const devices = input.map(this.parseInputLine);
        devices.forEach(d => this.deviceIndex[d.key] = d);

        return this.findPathsRec('you');
    }

    findPathsRec(currentKey: string): number {
        if (currentKey === 'out') return 1;

        let numValidPaths = 0;
        for (const nextKey of this.deviceIndex[currentKey].targets) {
            numValidPaths += this.findPathsRec(nextKey);
        }
        return numValidPaths;
    }

    parseInputLine(line: string): Device {
        const [key, targetString] = line.split(':');
        const targets = targetString.split(' ').filter(t => !!t);
        return { key, targets };
    }
}

// noinspection JSUnusedGlobalSymbols
export default (new Y2025_Day11_1());