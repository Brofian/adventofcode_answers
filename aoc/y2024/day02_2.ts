import AbstractRiddle from '../../src/JS/AbstractRiddle';

class Y2024_Day02_2 extends AbstractRiddle {

    riddle: string = "How many reports are safe?";

    run(input: string[]): number {


        const reports = input.map(line => {
            return line.split(' ').map(l => parseInt(l));
        });

        let validReports = 0;

        for (const report of reports) {
            // check original report
            if (this.isReportSave(report)) {
                validReports++;
                continue;
            }

            // check all permutations until one is safe
            for (const permutedReport of this.permuteReport(report)) {
                if (this.isReportSave(permutedReport)) {
                    validReports++;
                    break;
                }
            }
        }

        return validReports;
    }

    isReportSave(report: number[]): boolean {
        const increasing = report[0] < report[1];

        for (let i = 0; i < report.length-1; i++) {

            const currentData = report[i];
            const nextData = report[i+1];
            const diff = Math.abs(currentData - nextData);

            if ((currentData < nextData) !== increasing || diff < 1 || diff > 3) {
                return false;
            }
        }

        return true;
    }

    permuteReport(report: number[]): number[][] {
        const permutations: number[][] = [];

        for (let i = 0; i < report.length; i++) {
            const copy = [...report];
            copy.splice(i, 1);
            permutations.push(copy);
        }

        return permutations;
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day02_2());