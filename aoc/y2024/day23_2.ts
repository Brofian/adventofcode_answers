import AbstractRiddle from '../../src/JS/AbstractRiddle';


class Y2024_Day23_2 extends AbstractRiddle {

    riddle: string = "What is the password to get into the LAN party?";

    connections: { [key: string]: string[] } = {}

    /*
     * This riddle is basically the clique problem, which in itself is NP-hard.
     * This means, the first step is to find constraints with make the solving easier:
     * - Each node having the same amount of edges meaning this number is also the size of our solution
     */
    run(input: string[]): string | number | bigint {

        const lanConnections = input.map(line => line.split('-'));

        // create sets for uniqueness and fast access
        const computers = new Set<string>(lanConnections.flat());


        // Create a list of connections for every computer
        computers.forEach(comp => {
            this.connections[comp] = lanConnections
                .filter(conn => conn.includes(comp))
                .flat()
                .filter(c => c !== comp);
        })


        /*
         * Check some preconditions to make the problem solvable
         */
        const numConnectionsPerComputer = Object.values(this.connections).map(connArr => connArr.length);
        const numDifferentEdgesPerNode = [...new Set<number>(numConnectionsPerComputer)].length;
        this.assert(numDifferentEdgesPerNode === 1, "Every node has an equal amount of edges");


        type BronKerboschParameter = {
            R: Set<string>; // definetly contained vertices
            P: Set<string>; // possible contained vertices
            X: Set<string>; // not contained vertices
        }


        const parameters: BronKerboschParameter[] = [{
            R: new Set<string>(),
            X: new Set<string>(),
            P: computers,
        }];

        let result: Set<string> = undefined;

        let i = 0;
        while (parameters.length) {
            const parameter = parameters.shift();
            this.dump(`> new cycle ${i++} / ${parameters.length} with R ${parameter.R.size}, P ${parameter.P.size} and X ${parameter.X.size}`);

            const {R, P, X} = parameter;

            /*
             * Start Bron-Kerbosch-Algorithm
             */

            if (P.size === 0 && X.size === 0) {
                // found result in R
                if (!result || R.size > result.size) {
                    result = R; // keep the largest result
                }
                continue;
            }

            const pivotU = [...P, ...X][0];
            const pivotUNeighbours = this.connections[pivotU];

            for (const v of P) {
                if (pivotUNeighbours.includes(v)) {
                    continue;
                }

                const vNeighbours = this.connections[v];
                const recursion = {
                    R: (new Set<string>(R)).add(v),
                    P: new Set<string>(vNeighbours.filter(n => P.has(n))),
                    X: new Set<string>(vNeighbours.filter(n => X.has(n))),
                };
                // this.dump(`  > starting recursion of R ${recursion.R.size}, P ${recursion.P.size} and X ${recursion.X.size}`);
                parameters.push(recursion);

                P.delete(v);
                X.add(v);
            }
        }

        return [...result].sort().join(',');
    }
}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day23_2());