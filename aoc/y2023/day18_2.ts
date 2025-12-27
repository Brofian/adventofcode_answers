import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector from '../../src/JS/Geometry/Vector';

type ValidDirection = 'R'|'L'|'U'|'D';

type Instruction = {
    direction: ValidDirection,
    distance: number
}

class Y2023_Day18_2 extends AbstractRiddle {

    riddle: string = "What is the area that was dug out when using the instruction from the color data?";

    run(): number {
        const instructionRegex = /^(\D) (\d+) \(#([\d|\D]+)\)$/;
        const directions: ValidDirection[] = ['R','D','L','U'];
        const instructions: Instruction[] = this.readInput().map(line => {
            const matches = instructionRegex.exec(line);

            const encoded = matches[3];
            const direction = directions[parseInt(encoded.substring(5))];
            const distance = parseInt(encoded.substring(0,5), 16);

            return {
                direction: direction,
                distance: distance
            };
        });

        const currentPosition: Vector = Vector.create(0,0);

        let points: Vector[] = [currentPosition.clone()];

        let offset = Vector.create(0,0);
        let boundaryPoints: number = 0;

        // follow instructions
        for (const instruction of instructions) {
            const directionalVector = this.getVectorFromDirection(instruction.direction);
            const targetPosition = currentPosition.clone().add(directionalVector.scale(instruction.distance));

            points.push(targetPosition);
            boundaryPoints += instruction.distance;

            if(targetPosition.x < offset.x) offset.x = targetPosition.x;
            if(targetPosition.y < offset.y) offset.y = targetPosition.y;

            currentPosition.pull(targetPosition);
        }

        // move points into positive space
        points.forEach(point => point.add(offset));

        // shoelace scheme
        let areaX2 = 0;
        for (let i = 1; i < points.length; i++) {
            areaX2 += points[i-1].cross(points[i]);
        }
        areaX2 += points[points.length - 1].cross(points[0]);
        const area = areaX2 / 2;


        // picks theorem
        // A = (interior_points) + (boundary_points / 2) - 1
        // (interior_points) = A - (boundary_points / 2) + 1
        const interiorPoints = area - (boundaryPoints/2) + 1;


        return interiorPoints + boundaryPoints;
    }

    protected getVectorFromDirection(dir: ValidDirection): Vector {
        switch (dir) {
            case "U": return Vector.create(0, -1);
            case "D": return Vector.create(0,  1);
            case "R": return Vector.create(1,  0);
            case "L": return Vector.create(-1,  0);
        }
    }


}

// noinspection JSUnusedGlobalSymbols
export default (new Y2023_Day18_2());