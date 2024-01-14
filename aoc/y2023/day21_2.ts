import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector from '../../src/JS/Vector';



class Y2023_Day21_2 extends AbstractRiddle {

    riddle: string = "How many garden plots can be reached in exactly 64 steps?";

    protected map: boolean[][];

    run(): number {
        const startingPosition: Vector = Vector.create(0,0);
        this.map = this.readInput().map((line,y) => line.split('').map((char,x) => {
            if(char === 'S') {
                startingPosition.set(x,y);
                return true;
            }
            return char === '.';
        }));


        const mapWidth = this.map[0].length;
        const mapHeight = this.map.length;

        this.filterMapForReachableTiles(startingPosition, mapWidth, mapHeight);




        const freeTilesPerMap = this.map.reduce((carry, row) =>
            carry + row.reduce((carry2, tile) => carry2 + (tile?1:0), 0), 0);

        const stepsToTake = 26501365;

        // because we are going an unequal amount of steps, we can only reach half of the spaces on the map.
        // But because the map has an uneven number of spaces itself, the reachable tiles switch on all adjacent maps
        // basically making 0.5/(num of X) of the map available at all times

        // calculate the circle in which all tile are placed, that can be reached from the starting points

        const averageAvailabilityPerMap: number = 0.5 * (freeTilesPerMap / (mapWidth*mapHeight));

        const requiredMapsLeft  = ((stepsToTake - startingPosition.x)/mapWidth) +1;
        const requiredMapsRight = ((stepsToTake + startingPosition.x)/mapWidth) +1;
        const requiredMapsUp    = ((stepsToTake - startingPosition.y)/mapHeight)+1;
        const requiredMapsDown  = ((stepsToTake + startingPosition.y)/mapHeight)+1;

        let mapsFullyInCircle = 0;

        const range = requiredMapsLeft + requiredMapsRight;

        let i = 0;

        for (let mapX = -requiredMapsLeft; mapX < requiredMapsRight; mapX++) {
            i++;

            if (i%100 === 0) console.log(`${(mapX + requiredMapsLeft) / range}`);

            for (let mapY = -requiredMapsUp; mapY < requiredMapsDown; mapY++) {

                const ul = Vector.create(mapX * mapWidth, mapY * mapHeight);
                const distUL = Math.abs(ul.x - startingPosition.x) + Math.abs(ul.y - startingPosition.y);
                if (distUL > stepsToTake) {
                    continue;
                }

                const bl = Vector.create(mapX * mapWidth, (mapY+1) * mapHeight);
                const distBL = Math.abs(bl.x - startingPosition.x) + Math.abs(bl.y - startingPosition.y);
                if (distBL > stepsToTake) {
                    continue;
                }

                const ur = Vector.create((mapX+1) * mapWidth, mapY * mapHeight);
                const distUR = Math.abs(ur.x - startingPosition.x) + Math.abs(ur.y - startingPosition.y);
                if (distUR > stepsToTake) {
                    continue;
                }

                const br = Vector.create((mapX+1) * mapWidth, (mapY+1) * mapHeight);
                const distBR = Math.abs(br.x - startingPosition.x) + Math.abs(br.y - startingPosition.y);
                if (distBR > stepsToTake) {
                    continue;
                }



                // square is fully contained
                mapsFullyInCircle++;

            }
        }


        const areaPerMap = mapWidth * mapHeight;
        const areaOfCircle = Math.PI * (stepsToTake * stepsToTake);
        const areaOfPartialMaps = areaOfCircle - (mapsFullyInCircle * areaPerMap);


        const freeTilesOutsideCircle = (areaOfPartialMaps / areaPerMap) * freeTilesPerMap;
        const freeTilesOfMapsInCircle = mapsFullyInCircle * freeTilesPerMap;


        return freeTilesOfMapsInCircle + freeTilesOutsideCircle;
    }


    protected filterMapForReachableTiles(start: Vector, mapWidth: number, mapHeight: number): void {

        const reachabilityMap = this.create2DArray(mapWidth, mapHeight, (x,y) => false);

        const queue: Vector[] = [start];

        while (queue.length) {

            const current = queue.shift();

            if (reachabilityMap[current.y][current.x]) {
                continue;
            }

            reachabilityMap[current.y][current.x] = true;


            if (!reachabilityMap[this.mod(current.y + 1, mapHeight)][current.x] && this.map[this.mod(current.y + 1, mapHeight)][current.x]) {
                queue.push(Vector.create(current.x, this.mod(current.y + 1, mapHeight)));
            }

            if (!reachabilityMap[this.mod(current.y - 1, mapHeight)][current.x] && this.map[this.mod(current.y - 1, mapHeight)][current.x]) {
                queue.push(Vector.create(current.x, this.mod(current.y - 1, mapHeight)));
            }
            if (!reachabilityMap[current.y][this.mod(current.x + 1, mapWidth)] && this.map[current.y][this.mod(current.x + 1, mapWidth)]) {
                queue.push(Vector.create(this.mod(current.x + 1, mapWidth), current.y));
            }
            if (!reachabilityMap[current.y][this.mod(current.x - 1, mapWidth)] && this.map[current.y][this.mod(current.x - 1, mapWidth)]) {
                queue.push(Vector.create(this.mod(current.x - 1, mapWidth), current.y));
            }
        }


        this.map = reachabilityMap;
    }

    protected mod(n: number, mod: number): number {
        if (n >= 0) {
            return n % mod;
        }
        return (n + (Math.ceil(n/mod)+1)*mod);
    }
}

// noinspection JSUnusedGlobalSymbols
export default (new Y2023_Day21_2());