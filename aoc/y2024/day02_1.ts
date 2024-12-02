import AbstractRiddle from '../../src/JS/AbstractRiddle';

class Y2024_Day02_1 extends AbstractRiddle {

    riddle: string = "How many reports are safe?";

    run(input: string[]): number {

        const reports = input.map(line => {
            return line.split(' ').map(l => parseInt(l));
        });

        let validReports = 0;

        for (const report of reports) {
            const increasing = report[0] < report[1];
            let isValid = true;

            for (let i = 0; i < report.length-1; i++) {

                const currentData = report[i];
                const nextData = report[i+1];
                const diff = Math.abs(currentData - nextData);

                if ((currentData < nextData) !== increasing || diff < 1 || diff > 3) {
                    isValid = false;
                    break;
                }
            }

            if (isValid) {
                validReports++;
            }
        }



        return validReports;
    }



}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day02_1());