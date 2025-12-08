import AbstractRiddle from '../../src/JS/AbstractRiddle';


type Pos = {x: number, y: number, z: number};
const pos = (x: number, y: number, z: number): Pos => {
    return {x, y, z};
}
const sqr = (x: number) => x * x;


class  Y2025_Day08_2 extends AbstractRiddle {

    riddle: string = "What do you get if you multiply together the X coordinates of the last two junction boxes you need to connect?";

    run(input: string[]): number {

        const junctions: Pos[] = input.map(line => {
            const [x,y,z] = line.split(',',3).map(x => parseInt(x));
            return pos(x,y,z);
        });
        const numJunctions = junctions.length;

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

        for (let i = 0; i < distanceMap.length; i++) {
            const shortest = distanceMap.shift();

            // connect both circuits
            const circuit = circuits[shortest.a];
            for (const b of circuits[shortest.b]) {
                circuit.add(b);
                circuits[b] = circuit;
            }

            if (circuit.size === numJunctions) {
                // console.log(`found full circuit with ${shortest.a} and ${shortest.b}`);
                return junctions[shortest.a].x * junctions[shortest.b].x;
            }
        }

        throw new Error("If you got to this point... you did something wrong");
    }



}

// noinspection JSUnusedGlobalSymbols
export default (new Y2025_Day08_2());