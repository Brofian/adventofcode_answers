import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector from "../../src/JS/Vector";


class Y2024_Day23_1 extends AbstractRiddle {

    riddle: string = "How many contain at least one computer with a name that starts with t?";

    run(input: string[]): string | number | bigint {

        const lanConnections = input.map(line => line.split('-'));

        // create sets for uniqueness and fast access
        const computers = new Set<string>(lanConnections.flat());
        const connections = new Set<string>(input);

        const trippleConnections = new Set<string>();

        for (const lanConnection of lanConnections) {
            const [compA, compB] = lanConnection;

            let containsT = compA.startsWith('t') || compB.startsWith('t');

            for (const compC of computers) {

                if (!containsT && !compC.startsWith('t')) {
                    continue; // none of them starts with the letter t
                }

                if (!connections.has(`${compA}-${compC}`) && !connections.has(`${compC}-${compA}`)) {
                    continue; // compC is not connected to compA
                }

                if (!connections.has(`${compB}-${compC}`) && !connections.has(`${compC}-${compB}`)) {
                    continue; // compC is not connected to compB
                }

                // we have a triple (sort them, to prevent counting a triplet double)
                const tripleKey = [compA, compB, compC].sort().join('|');
                trippleConnections.add(tripleKey);
            }
        }

        return trippleConnections.size;
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day23_1());