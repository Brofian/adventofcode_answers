import AbstractRiddle from '../../src/JS/AbstractRiddle';


type Pos = {x: number, y: number, z: number};
const pos = (x: number, y: number, z: number): Pos => {
    return {x, y, z};
}
const sqr = (x: number) => x * x;


class  Y2025_Day08_1 extends AbstractRiddle {

    riddle: string = "What do you get if you multiply together the sizes of the three largest circuits?";

    run(input: string[]): number {

        const junctions: Pos[] = input.map(line => {
            const [x,y,z] = line.split(',',3).map(x => parseInt(x));
            return pos(x,y,z);
        });

        const distanceMap: {a: number, b: number, dist: number}[] = [];

        for (let a = 0; a < junctions.length; a++) {
            for (let b = a+1; b < junctions.length; b++) {
                const aPos = junctions[a];
                const bPos = junctions[b];
                const sqrDist = sqr(aPos.x - bPos.x) + sqr(aPos.y - bPos.y) + sqr(aPos.z - bPos.z);
                distanceMap.push({
                    a: a, b: b, dist: sqrDist
                });
            }
        }

        distanceMap.sort((a,b) => a.dist <= b.dist ? -1 : 1);


        const circuits: {[key: number]: Set<number>} = {};
        junctions.forEach((_,i) => {
            circuits[i] = new Set<number>([i]);
        });

        const N = 1000;
        for (let i = 0; i < N; i++) {
            const shortest = distanceMap.shift();

            // connect both circuits
            const circuit = circuits[shortest.a];
            for (const b of circuits[shortest.b]) {
                circuit.add(b);
                circuits[b] = circuit;
            }
        }

        const finalCircuits = [...new Set(Object.values(circuits))];
        finalCircuits.sort((a,b) => a.size > b.size ? -1 : 1);

        return finalCircuits.splice(0,3).reduce((acc, curr) => acc * curr.size, 1);
    }



}

// noinspection JSUnusedGlobalSymbols
export default (new Y2025_Day08_1());