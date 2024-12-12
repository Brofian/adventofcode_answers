import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector from "../../src/JS/Vector";

type Adjacency = {
    top: boolean,
    left: boolean,
    bottom: boolean,
    right: boolean,
}

class Y2024_Day12_1 extends AbstractRiddle {

    riddle: string = "What is the total price of fencing all regions on your map?";

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

        let totalPrice = 0;

        for (let x = 0; x < gardenWidth; x++) {
            for (let y = 0; y < gardenHeight; y++) {
                if (checkList[y][x]) continue;

                const plotCache: string[] = [];
                const tileQueue: Vector[] = [
                    Vector.create(x,y)
                ];
                let edges = 0;

                while (tileQueue.length) {
                   const tileCoords = tileQueue.shift();
                   if (plotCache.includes(tileCoords.toString())) continue;
                   else plotCache.push(tileCoords.toString());

                   checkList[tileCoords.y][tileCoords.x] = true;


                   const tile = adjacencies[tileCoords.y][tileCoords.x];

                   if (tile.top) tileQueue.push(Vector.create(tileCoords.x,tileCoords.y-1));
                   else edges++;
                   if (tile.bottom) tileQueue.push(Vector.create(tileCoords.x,tileCoords.y+1));
                   else edges++;
                   if (tile.left) tileQueue.push(Vector.create(tileCoords.x-1,tileCoords.y));
                   else edges++;
                   if (tile.right) tileQueue.push(Vector.create(tileCoords.x+1,tileCoords.y));
                   else edges++;
                }

                totalPrice += plotCache.length * edges;
                //console.log(`For ${gardens[y][x]}: ${plotCache.length} plots with ${edges} + ${edges} edges`);
            }
        }

        return totalPrice;
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day12_1());