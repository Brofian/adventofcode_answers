import AbstractRiddle from '../../src/JS/AbstractRiddle';


type Device = {
    key: string;
    targets: string[];
    routes: {
        checkedOUT: boolean;
        checkedFFT: boolean;
        checkedDAC: boolean;
        toOUT: boolean;
        toFFT: boolean;
        toDAC: boolean;
    }
}

class Y2025_Day11_2 extends AbstractRiddle {

    riddle: string = "How many of those paths visit both dac and fft?";

    deviceIndex: { [key: string]: Device } = {};
    predecessors: { [key: string]: string[] } = {};

    run(input: string[]): number {
        const devices = input.map(this.parseInputLine);
        this.dump('Initial: ' + devices.length);

        const remainingDevices = this.simplifyDeviceRoutes(devices);
        this.dump('Remaining: ' + remainingDevices.length);


        remainingDevices.forEach(d => {
            this.deviceIndex[d.key] = d;
            this.predecessors[d.key] = [];
        });
        this.deviceIndex['out'] = {
            key: 'out', routes: {
                checkedOUT: false,
                checkedDAC: false,
                checkedFFT: false,
                toOUT: false,
                toDAC: false,
                toFFT: false,
            }, targets: []
        }
        this.predecessors['out'] = [];
        remainingDevices.forEach(d => d.targets.forEach(t => {
            this.predecessors[t].push(d.key);
        }));
        this.dump('Calculated index and predecessors');

        this.markPathsToFFT();
        this.markPathsToDAC();
        this.markPathsToOUT();
        this.dump('Marked paths to FFT, DAC and OUT');

        this.assert(
            remainingDevices.every(d => !d.routes.toFFT || d.routes.toDAC ),
            'All paths through FFT lead to DAC'
        );
        this.assert(
            remainingDevices.every(d => !d.routes.toDAC || d.routes.toOUT ),
            'All paths through DAC lead to OUT'
        );

        const svr2FFT = this.findPathsRec('svr', 'fft', (nextKey: string, nextDevice: Device) => {
            return (
                nextDevice.routes.toFFT && // skip if this does not lead to FFT
                nextKey !== 'dac' // skip if we would reach the next step early
            );
        });

        const fft2DAC = this.findPathsRec('fft', 'dac', (nextKey: string, nextDevice: Device) => {
            return (
                nextDevice.routes.toDAC && // skip if this does not lead to DAC
                nextKey !== 'out' // skip if we would reach the next step early
            );
        });

        const dac2OUT = this.findPathsRec('dac', 'out', (nextKey: string, nextDevice: Device) => {
            return (
                nextDevice.routes.toOUT // skip if this does not lead to OUT
            );
        });

        return svr2FFT * fft2DAC * dac2OUT;
    }

    markPathsToFFT(): void {
        const buffer: string[] = ['fft'];
        let i = 0;

        while (buffer.length > 0) {
            const key = buffer.pop();
            const d = this.deviceIndex[key];

            if (d.routes.checkedFFT) continue;
            d.routes.checkedFFT = d.routes.toFFT = true;
            i++;

            buffer.push(...this.predecessors[key]);
        }
        console.log(`${i} nodes lead to FFT`);
    }

    markPathsToDAC(): void {
        const buffer: string[] = ['dac'];
        let i = 0;

        while (buffer.length > 0) {
            const key = buffer.pop();
            const d = this.deviceIndex[key];

            if (d.routes.checkedDAC) continue;
            d.routes.checkedDAC = d.routes.toDAC = true;
            i++;

            buffer.push(...this.predecessors[key]);
        }
        console.log(`${i} nodes lead to DAC`);
    }


    markPathsToOUT(): void {
        const buffer: string[] = ['out'];
        let i = 0;

        while (buffer.length > 0) {
            const key = buffer.pop();
            const d = this.deviceIndex[key];

            if (d.routes.checkedOUT) continue;
            d.routes.checkedOUT = d.routes.toOUT = true;
            i++;

            buffer.push(...this.predecessors[key]);
        }
        console.log(`${i} nodes lead to OUT`);
    }

    simplifyDeviceRoutes(devices: Device[]): Device[] {
        const remainingDevices: Device[] = [];

        for (let deviceIndex = 0; deviceIndex < devices.length; deviceIndex++) {
            const d = devices[deviceIndex];

            if (d.targets.length === 1) {
                const t = d.targets[0];
                // replace this device everywhere
                for (const o of devices) {
                    const i = o.targets.indexOf(d.key);
                    if (i >= 0) {
                        o.targets.splice(i, 1, t);
                    }
                }
            } else {
                remainingDevices.push(d);
            }
        }

        return remainingDevices;
    }

    findPathsRec(currentKey: string, target: string, predicate: { (key: string, d: Device): boolean }): number {
        if (currentKey === target) {
            return 1;
        }

        const current = this.deviceIndex[currentKey];


        let paths = 0;
        for (const nextKey of current.targets) {
            const t = this.deviceIndex[nextKey];
            if (predicate(nextKey, t)) {
                paths += this.findPathsRec(nextKey, target, predicate);
            }
        }
        return paths;
    }

    parseInputLine(line: string): Device {
        const [key, targetString] = line.split(':');
        const targets = targetString.split(' ').filter(t => !!t);
        return {
            key,
            targets: [...new Set(targets)],
            routes: {
                checkedOUT: false,
                checkedFFT: false,
                checkedDAC: false,
                toOUT: false,
                toFFT: false,
                toDAC: false
            }
        };
    }
}

// noinspection JSUnusedGlobalSymbols
export default (new Y2025_Day11_2());