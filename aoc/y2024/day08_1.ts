import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector from "../../src/JS/Vector";

type Node = {
    id: string;
    pos: Vector;
}

class Y2024_Day08_1 extends AbstractRiddle {

    riddle: string = "How many unique locations within the bounds of the map contain an antinode?";

    run(input: string[]): number {

        const nodes: {[key: string]: Node[]} = {};
        input.forEach((line, y) =>
            line.split('').forEach((id, x) => {
                if (id === '.') return;
                if (!nodes[id]) nodes[id] = [];
                nodes[id].push({
                    id: id,
                    pos: Vector.create(x,y),
                })
            })
        );


        const bounds: [Vector,Vector] = [
            Vector.create(0,0),
            Vector.create(input[0].length-1, input.length-1)
        ];


        const antiNodes: {[key: string]: Vector} = {};

        for (const id in nodes) {
            const designatedNodes = nodes[id];

            for (const nodeA of designatedNodes) {
                for (const nodeB of designatedNodes) {
                    if (nodeA === nodeB) continue;

                    // nodeA + distVec = nodeB
                    const distVec = nodeB.pos.clone().sub(nodeA.pos);

                    const generatedAntiNodes = [
                        nodeA.pos.clone().sub(distVec),
                        nodeB.pos.clone().add(distVec)
                    ];

                    for (const antiNode of generatedAntiNodes) {
                        if (antiNode.in(...bounds)) {
                            const key = `${antiNode.x}|${antiNode.y}`;
                            antiNodes[key] = antiNode;
                        }
                    }
                }
            }
        }

        return Object.keys(antiNodes).length;
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day08_1());