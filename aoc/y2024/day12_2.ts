import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector from "../../src/JS/Geometry/Vector";

type Adjacency = {
    top: boolean,
    left: boolean,
    bottom: boolean,
    right: boolean,
}

const adjacencyDirections: {[key in keyof Adjacency]: Vector} = {
    top: Vector.create(1,0),
    bottom: Vector.create(1,0),
    left: Vector.create(0, 1),
    right: Vector.create(0, 1),
};

class Y2024_Day12_1 extends AbstractRiddle {

    riddle: string = "What is the new total price of fencing all regions on your map?";

    run(input: string[]): number {

        const gardens: string[][] = input.map(line => line.split(''));
        const gardenHeight = gardens.length;
        const gardenWidth = gardens[0].length;

        const adjacencies: Adjacency[][] = gardens.map((row,y) => {
            return row.map((cell, x) => {
                return {
                    top: y > 0 && gardens[y-1][x] === cell,
                    bottom: y < gardenHeight-1 && gardens[y+1][x] === cell,
                    left: x > 0 && gardens[y][x-1] === cell,
                    right: x < gardenWidth-1 && gardens[y][x+1] === cell,
                }
            })
        });


        const checkList = this.create2DArray(gardenHeight, gardenWidth, _ => false);

        let totalSites = 0;

        for (let x = 0; x < gardenWidth; x++) {
            for (let y = 0; y < gardenHeight; y++) {
                if (checkList[y][x]) continue;

                const plotCache: {[key: string]: [Vector, Adjacency]} = {};
                const tileQueue: Vector[] = [
                    Vector.create(x,y)
                ];

                while (tileQueue.length) {
                   const tileCoords = tileQueue.shift();
                   if (plotCache[tileCoords.toString()]) continue;

                   checkList[tileCoords.y][tileCoords.x] = true;


                   const tile = adjacencies[tileCoords.y][tileCoords.x];
                   plotCache[tileCoords.toString()] = [tileCoords, tile];

                   if (tile.top) tileQueue.push(Vector.create(tileCoords.x,tileCoords.y-1));
                   if (tile.bottom) tileQueue.push(Vector.create(tileCoords.x,tileCoords.y+1));
                   if (tile.left) tileQueue.push(Vector.create(tileCoords.x-1,tileCoords.y));
                   if (tile.right) tileQueue.push(Vector.create(tileCoords.x+1,tileCoords.y));
                }

                let sides = 0;

                const adjacencyToCheck: (keyof Adjacency)[] = ['top', 'bottom', 'left', 'right'];

                for (const [tileCoords, adjacency] of Object.values(plotCache)) {
                    for (const a of adjacencyToCheck) {
                        if (!adjacency[a]) { // scan the whole line and remove sides, that are connected
                            adjacency[a] = true;
                            for (let dir of [adjacencyDirections[a], adjacencyDirections[a].clone().scale(-1)]) {
                                const neighbourCoords = tileCoords.clone().add(dir);
                                while (plotCache[neighbourCoords.toString()] && !plotCache[neighbourCoords.toString()][1][a]) {
                                    plotCache[neighbourCoords.toString()][1][a] = true; // we are done with this
                                    neighbourCoords.add(dir);
                                }
                            }
                            //console.log(`> removed sides for area ${gardens[y][x]} on side ${a}`);
                            sides++;
                        }
                    }
                }

//                console.log(`Area ${gardens[y][x]} has ${sides} sides`);
                totalSites += sides * Object.values(plotCache).length;
            }
        }

        return totalSites;
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day12_1());