import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector from "../../src/JS/Geometry/Vector";

class Y2024_Day10_1 extends AbstractRiddle {

    riddle: string = "What is the sum of the ratings of all trailheads?";

    run(input: string[]): number {

        const map: number[][] = input.map(line => line.split('').map(c => parseInt(c)));

        const hikingTrails: Vector[] = [];
        map.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell === 0) {
                    hikingTrails.push(Vector.create(x,y));
                }
            })
        })

        const mapBounds: [Vector,Vector] = [
            Vector.create(0,0),
            Vector.create(map[0].length-1, map.length-1)
        ];

        let sumOfScores = 0;
        for (const hikingTrail of hikingTrails) {

            const tilesToCheckNeighboursOf: Vector[] = [hikingTrail];

            while (tilesToCheckNeighboursOf.length > 0) {
                const tileToCheck = tilesToCheckNeighboursOf.pop();

                const currentHeight = map[tileToCheck.y][tileToCheck.x];
                if (currentHeight === 9) {
                    sumOfScores++;
                    continue;
                }


                for (const dir of [[-1,0],[1,0],[0,-1],[0,1]] as [number,number][]) {
                    const dirVector = Vector.create(...dir);
                    const neighbour = tileToCheck.clone().add(dirVector);

                    if (neighbour.in(...mapBounds) && map[neighbour.y][neighbour.x] === currentHeight+1) {
                        tilesToCheckNeighboursOf.push(neighbour);
                    }
                }
            }
        }

        return sumOfScores;
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day10_1());