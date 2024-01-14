import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector from '../../src/JS/Vector';

type Trigger = {senderKey: string, receiverKey: string, pulse: boolean};

abstract class Module {
    protected system: System;

    public key: string;
    public destinationModules: string[] = [];
    public inputModules: string[] = [];
    public currentOutSignal: boolean = false;

    constructor(key: string, destinationModules: string[], system: System) {
        this.destinationModules = destinationModules;
        this.system = system;
        this.key = key;
    }

    abstract receivePulse(senderKey: string, isHigh: boolean): Trigger[];

    sendUpdatePulses(): Trigger[] {
        return this.destinationModules.map(dest => {
            return {
                senderKey: this.key,
                receiverKey: dest,
                pulse: this.currentOutSignal
            };
        });
    }
}

class FlipFlop extends Module {
    receivePulse(senderKey: string, isHigh: boolean): Trigger[] {
        if (!isHigh) {
            this.currentOutSignal = !this.currentOutSignal;
            return this.sendUpdatePulses();
        }
        return [];
    }
}

class Conjunction extends Module {
    lastPulses: {[key: string]: boolean} = {};

    receivePulse(senderKey: string, isHigh: boolean): Trigger[] {
        this.lastPulses[senderKey] = isHigh;

        this.currentOutSignal = !this.inputModules.every(m => this.lastPulses[m]);
        return this.sendUpdatePulses();
    }
}

class Broadcaster extends Module {
    receivePulse(senderKey: string, isHigh: boolean): Trigger[] {
        this.currentOutSignal = isHigh;
        return this.sendUpdatePulses();
    }
}


type System = {[key: string]: Module}

class Y2023_Day20_1 extends AbstractRiddle {

    riddle: string = "What is the product of the total low and total high pulses fired after one button press?";

    protected system: System = {};

    run(): number {
        const lineRegex = /^([%&]?)(\D+) -> (\D+)$/;
        const keys: string[] = this.readInput().map(line => {
            const matches = lineRegex.exec(line);

            const destModules: string[] = matches[3].split(',').map(el => el.trim());
            const key = matches[2];

            switch (matches[1]){
                case "": // broadcaster
                    this.system[key] = new Broadcaster(key, destModules, this.system);
                    break;
                case "%": // flip-flop
                    this.system[key] = new FlipFlop(key, destModules, this.system);
                    break;
                case "&": // conjunction
                    this.system[key] = new Conjunction(key, destModules, this.system);
                    break;
            }

            return key;
        });

        // set input nodes
        for (const key of keys) {
            for (const dest of this.system[key].destinationModules) {
                if (this.system[dest] === undefined) {
                    //this.dump(dest);
                    continue;
                }

                this.system[dest].inputModules.push(key);
            }
        }


        let totalLowPulses = 0;
        let totalHighPulses = 0;

        for (let i = 0; i < 1000; i++) {
            const newPulses = this.pressButton();
            totalLowPulses += newPulses[0];
            totalHighPulses += newPulses[1];
        }


        return totalHighPulses * totalLowPulses;
    }


    protected pressButton(): number[] {
        const triggersToProcess = this.system['broadcaster'].receivePulse("button",false);

        let pulsesSent: number[] = [1,0];

        while (triggersToProcess.length > 0) {

            const nextTriggerGeneration: Trigger[] = [];
            for (const trigger of triggersToProcess) {
                pulsesSent[trigger.pulse ? 1 : 0]++;

                // console.log(`${trigger.senderKey} -${trigger.pulse ? 'HIGH' : 'LOW'}-> ${trigger.receiverKey}`);

                if (this.system[trigger.receiverKey] === undefined) {
                    continue;
                }

                const generatedTriggers = this.system[trigger.receiverKey].receivePulse(trigger.senderKey, trigger.pulse);
                nextTriggerGeneration.push(...generatedTriggers);

            }
            triggersToProcess.length = 0;
            triggersToProcess.push(...nextTriggerGeneration);
        }

        return pulsesSent;
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2023_Day20_1());