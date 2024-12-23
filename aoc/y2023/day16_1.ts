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
     * @param mapWidth
     * @param mapHeight
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

class Y2023_Day16_1 extends AbstractRiddle {

    riddle: string = "How many tiles are energized by the path of the laser?";

    run(): number {
        const map: string[][] = this.readInput().map(line => line.trim().split(''));
        const mapHeight = map.length;
        const mapWidth = map[0].length;

        const beamParts: BeamHead[] = [
            new BeamHead(0,0, 1,0)
        ];

        const energyMap: number[][] = this.createMappedArray(mapHeight, () => this.createArray(mapWidth, 0));
        const beamMap: string[][][] = this.createMappedArray(mapHeight, () => this.createMappedArray(mapWidth, (_): string[] => []));

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


                // try to move the beam according to its current tile
                const currentTile = map[pos.y][pos.x];

                let skipStepForPart = false;

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
                            if (rightBeam.isInMap(mapWidth, mapHeight))    beamParts.push(rightBeam);
                            if (leftBeam.isInMap(mapWidth, mapHeight))     beamParts.push(leftBeam);

                            // move this beam way outside the map, so it will be removed after the step is performed
                            beamPart.position.x = -100;
                        }
                        break;
                    case '|':
                        if (beamPart.direction.x !== 0) {
                            // split
                            const upBeam = new BeamHead(pos.x, pos.y+1, 0, 1);
                            const downBeam = new BeamHead(pos.x, pos.y-1, 0, -1);
                            if (upBeam.isInMap(mapWidth, mapHeight))    beamParts.push(upBeam);
                            if (downBeam.isInMap(mapWidth, mapHeight))  beamParts.push(downBeam);

                            // move this beam way outside the map, so it will be removed after the step is performed
                            beamPart.position.x = -100;
                        }
                        break;
                }

                if (!skipStepForPart) {
                    const isInsideMap = beamPart.step(mapWidth, mapHeight);
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
export default (new Y2023_Day16_1());