import AbstractRiddle from '../../src/JS/AbstractRiddle';

class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(v: Vector) {
        this.x += v.x;
        this.y += v.y;
    }
}

class BeamHead {
    position: Vector;
    direction: Vector;

    constructor(x: number, y: number, xd: number, yd: number) {
        this.position = new Vector(x,y);
        this.direction = new Vector(xd,yd);
    }

    /**
     * Move the beam one step in the current direction and return if it is still inside the map
     * @param this.mapWidth
     * @param this.mapHeight
     */
    step(mapWidth: number, mapHeight: number): boolean {
        this.position.add(this.direction);
        return this.isInMap(mapWidth, mapHeight);
    }

    isInMap(mapWidth: number, mapHeight: number): boolean {
        return (
            this.position.x >= 0
            && this.position.y >= 0
            && this.position.x < mapWidth
            && this.position.y < mapHeight
        );
    }
}

class Y2023_Day16_2 extends AbstractRiddle {

    riddle: string = "How many tiles are energized at max by the best path of the laser?";

    mapHeight: number;
    mapWidth: number;
    map: string[][];
    
    run(): number {
        this.map = this.readInput().map(line => line.trim().split(''));
        this.mapHeight = this.map.length;
        this.mapWidth = this.map[0].length;


        let maxEnergy = -Infinity;
        for (let x = 0; x < this.mapWidth; x++) {
            maxEnergy = Math.max(
                maxEnergy,
                this.runSimulation(x, 0, 0, 1),
                this.runSimulation(x, this.mapHeight-1, 0, -1),
            );
        }
        for (let y = 0; y < this.mapHeight; y++) {
            maxEnergy = Math.max(
                maxEnergy,
                this.runSimulation(0, y, 1, 0),
                this.runSimulation(this.mapWidth-1, y, -1, 0),
            );
        }




        return maxEnergy;
    }

    protected runSimulation(initialX: number, initialY: number, initialXD: number, initialYD: number): number {
        const beamParts: BeamHead[] = [
            new BeamHead(initialX,initialY, initialXD,initialYD)
        ];


        const energyMap: number[][] = this.createMappedArray(this.mapHeight, () => this.createArray(this.mapWidth, 0));
        const beamMap: string[][][] = this.createMappedArray(this.mapHeight, () => this.createMappedArray(this.mapWidth, _ => []));

        // loop until no changes happen anymore
        while (beamParts.length > 0) {

            for (const beamPart of beamParts) {
                const pos = beamPart.position;

                // energize the current tile
                energyMap[pos.y][pos.x] = 1;

                const key = beamPart.direction.y+'_'+beamPart.direction.x;
                if (beamMap[pos.y][pos.x].includes(key)) {
                    // this is a loop, remove this beam immediately
                    beamParts.splice(beamParts.indexOf(beamPart), 1);
                    continue;
                }
                else {
                    beamMap[pos.y][pos.x].push(key);
                }

                let skipStepForPart = false;

                // try to move the beam according to its current tile
                const currentTile = this.map[pos.y][pos.x];
                switch (currentTile) {
                    case '/':
                        // +x -> -y
                        // -x -> +y
                        // +y -> -x
                        // -y -> +x
                        const tmp1 = -beamPart.direction.x;
                        beamPart.direction.x = -beamPart.direction.y;
                        beamPart.direction.y = tmp1;
                        break;
                    case '\\':
                        // +x -> +y
                        // -x -> -y
                        // +y -> +x
                        // -y -> -x
                        const tmp2 = beamPart.direction.x;
                        beamPart.direction.x = +beamPart.direction.y;
                        beamPart.direction.y = tmp2;
                        break;
                    case '-':
                        if (beamPart.direction.y !== 0) {
                            // split
                            const rightBeam = new BeamHead(pos.x+1, pos.y, 1, 0);
                            const leftBeam = new BeamHead(pos.x-1, pos.y, -1, 0);
                            if (rightBeam.isInMap(this.mapWidth, this.mapHeight))    beamParts.push(rightBeam);
                            if (leftBeam.isInMap(this.mapWidth, this.mapHeight))     beamParts.push(leftBeam);

                            // move this beam way outside the map, so it will be removed after the step is performed
                            beamPart.position.x = -100;
                        }
                        break;
                    case '|':
                        if (beamPart.direction.x !== 0) {
                            // split
                            const upBeam = new BeamHead(pos.x, pos.y+1, 0, 1);
                            const downBeam = new BeamHead(pos.x, pos.y-1, 0, -1);
                            if (upBeam.isInMap(this.mapWidth, this.mapHeight))    beamParts.push(upBeam);
                            if (downBeam.isInMap(this.mapWidth, this.mapHeight))  beamParts.push(downBeam);

                            // move this beam way outside the map, so it will be removed after the step is performed
                            beamPart.position.x = -100;
                        }
                        break;
                }

                if (!skipStepForPart) {
                    const isInsideMap = beamPart.step(this.mapWidth, this.mapHeight);
                    if (!isInsideMap) {
                        beamParts.splice(beamParts.indexOf(beamPart), 1);
                    }
                }
            }
        }

        let totalEnergy = 0;
        for (const row of energyMap) {
            for (const tile of row) {
                totalEnergy += tile;
            }
        }
        return totalEnergy;
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2023_Day16_2());