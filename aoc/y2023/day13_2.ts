import AbstractRiddle from '../../src/JS/AbstractRiddle';


type Pattern = string[];

class Y2023_Day13_1 extends AbstractRiddle {

    riddle: string = "What is the sum of the horizontal patterns and the vertical patterns times 100 after removing smudges?";


    run(): number {
        const lines: string[] = this.readInput().map(line => line.trim());

        const patterns: Pattern[] = [[]];
        for (const line of lines) {
            if (line === '') {
                patterns.push([]);
            }
            else {
                patterns[patterns.length-1].push(line);
            }
        }


        let sum = 0;
        let i = 0;
        for (const pattern of patterns) {
            // console.log('Pattern at line: ' + (i+1));
            i += pattern.length + 1;
            sum += this.findPattern(pattern);
        }

        return sum;
    }

    protected findPattern(pattern: Pattern): number {

        let sum = 0;

        // find horizontal row patterns
        for (let y = pattern.length-1; y >= 1; y--) {
            if (this.checkPatternAt(pattern, y) && !this.oldCheckPatternAt(pattern, y)) {
                sum += y * 100;
            }
        }

        // find vertical column patterns
        const t = this.transpose(pattern);
        for (let y = t.length-1; y >= 1; y--) {
            if (this.checkPatternAt(t, y) && !this.oldCheckPatternAt(t, y)) {
                sum += y;
            }
        }

        return sum;
    }

    protected stringDiff(a: string, b: string): number {
        let diff = 0;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) diff++;
        }
        return diff;
    };

    protected checkPatternAt(pattern: Pattern, at: number): boolean {
        const diff = this.stringDiff(pattern[at-1], pattern[at]);

        if (diff >= 2) {
            return false;
        }

        let allowSmudge = diff === 0;

        // found potential pattern, validate!
        const minRequiredMirrored = Math.min(at-1, pattern.length - at - 1);
        for (let yCheck = 1; yCheck <= minRequiredMirrored; yCheck++) {
            const cDiff = this.stringDiff(pattern[at - 1 - yCheck], pattern[at + yCheck]);
            if (cDiff >= 2) {
                return false;
            }
            else if (cDiff === 1 && allowSmudge) {
                allowSmudge = false;
            }
            else if (cDiff === 1) {
                return false;
            }
        }

        return true;
    }

    protected oldCheckPatternAt(pattern: Pattern, at: number): boolean {

        if (pattern[at-1] !== pattern[at]) {
            return false;
        }

        // found potential pattern, validate!
        const minRequiredMirrored = Math.min(at-1, pattern.length - at - 1);
        for (let yCheck = 1; yCheck <= minRequiredMirrored; yCheck++) {
            if (pattern[at - 1 - yCheck] !== pattern[at + yCheck]) {
                return false;
            }
        }

        return true;
    }

    protected transpose(pattern: Pattern): Pattern {
        const transposed: Pattern = [];
        for (let x = 0; x < pattern[0].length; x++) {
            transposed.push(pattern.map(row => row[x]).join(''));
        }
        return transposed
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2023_Day13_1());