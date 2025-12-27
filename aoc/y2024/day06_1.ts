import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector from "../../src/JS/Geometry/Vector";


class Y2024_Day06_1 extends AbstractRiddle {

    riddle: string = "How many distinct positions will the guard visit before leaving the mapped area?";

    run(input: string[]): number {

        const guardPosition: Vector = new Vector(0,0);
        let facing: Vector = new Vector(0,0);

        const map = input.map((line, y) => {
            const m = line.match(/[v^><]/);
            if (m) {
                guardPosition.set(m.index, y);
                switch (m[0] as 'v'|'^'|'<'|'>') {
                    case 'v':
                        facing.set(0,1);
                        break;
                    case '^':
                        facing.set(0,-1);
                        break;
                    case '<':
                        facing.set(-1,0);
                        break;
                    case '>':
                        facing.set(1,0);
                        break;
                }

            }
            return line.split('');
        });

        const mapBounds: [Vector, Vector] = [
            Vector.create(0,0),
            Vector.create(map[0].length - 1, map.length - 1)
        ];


        while (guardPosition.in(mapBounds[0], mapBounds[1])) {
            map[guardPosition.y][guardPosition.x] = 'X';

            const target = guardPosition.clone().add(facing);

            if (target.in(mapBounds[0], mapBounds[1]) && map[target.y][target.x] === '#') {
                // rotate right
                if      (facing.x === 0 && facing.y ===  1) facing.set(-1,0);
                else if (facing.x === 0 && facing.y === -1) facing.set( 1,0);
                else if (facing.x ===  1 && facing.y === 0) facing.set( 0, 1);
                else if (facing.x === -1 && facing.y === 0) facing.set( 0,-1);
            }
            else {
                guardPosition.pull(target);
            }
        }

        return map.reduce((carry, line) => {
            return carry + line.reduce((carry2, cell) => (cell === 'X' ? carry2+1 : carry2), 0)
        }, 0);
    }



}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day06_1());