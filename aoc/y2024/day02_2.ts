import AbstractRiddle from '../../src/JS/AbstractRiddle';

class Y2024_Day02_2 extends AbstractRiddle {

    riddle: string = "How many reports are safe?";

    run(input: string[]): number {

        const reports = input.map(line => {
            return line.split(' ').map(l => parseInt(l));
        });

        let validReports = 0;

        for (const report of reports) {

            for (const permutedReport of this.permuteReport(report)) {

                const increasing = permutedReport[0] < permutedReport[1];
                let isValid = true;

                for (let i = 0; i < permutedReport.length-1; i++) {

                    const currentData = permutedReport[i];
                    const nextData = permutedReport[i+1];
                    const diff = Math.abs(currentData - nextData);

                    if ((currentData < nextData) !== increasing || diff < 1 || diff > 3) {
                        isValid = false;
                        break;
                    }
                }

                if (isValid) {
                    validReports++;
                    break;
                }
            }

        }

        return validReports;
    }

    permuteReport(report: number[]): number[][] {
        const permutations: number[][] = [
            report
        ];

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