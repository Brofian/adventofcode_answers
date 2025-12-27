import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector from "../../src/JS/Geometry/Vector";

// each tile must remember, if the guard was on it, facing in direction x
type TileFacings = {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
};

type Guard = {
    pos: Vector;
    facing: Vector;
}

class Y2024_Day06_2 extends AbstractRiddle {

    riddle: string = "How many different positions could you choose for this obstruction?";
    
    mapBounds: [Vector, Vector];
    
    run(input: string[]): number {

        const guard: Guard = {
            pos: new Vector(0,0),
            facing: new Vector(0,0),
        }
        
        const obstacleMap = input.map((line, y) => {
            const m = line.match(/[v^><]/);
            if (m) {
                guard.pos.set(m.index, y);
                if (m[0] === 'v')   guard.facing.set(0,1);
                if (m[0] === '^')   guard.facing.set(0,-1);
                if (m[0] === '<')   guard.facing.set(-1,0);
                if (m[0] === '>')   guard.facing.set(1,0);
            }
            return line.split('');
        });

        const checkedPlacementsMap = this.create2DArray(
            obstacleMap[0].length,
            obstacleMap.length,
            () => false,
        );

        this.mapBounds = [
            Vector.create(0,0),
            Vector.create(obstacleMap[0].length - 1, obstacleMap.length - 1)
        ];


        // simulate guard path
        // todo: for every possible position of the guard, assume the next (free) tile would be the
        //  additional obstacle and trace the new path.
        //  For this, pass a modified copy of the obstacleMap and an exact copy of the current movementMap to the simulateGuardPath method
        // Maybe add a callback to the simulateGuardPath method?

        let validPositions = 0;

        this.simulateGuardPath(
            guard,
            obstacleMap,
            this.create2DArray(obstacleMap[0].length, obstacleMap.length, (): TileFacings => {
                return {
                    up: false,
                    down: false,
                    left: false,
                    right: false,
                };
            }),
            (g,o,m) => {

                const target = g.pos.clone().add(g.facing);

                if (target.in(this.mapBounds[0], this.mapBounds[1]) && obstacleMap[target.y][target.x] !== '#') {

                    // do not re check tiles, just because we walk them again. This would have caused another path the first time!
                    if (checkedPlacementsMap[target.y][target.x]) {
                        return;
                    }
                    checkedPlacementsMap[target.y][target.x] = true;

                    // imagine, there would be an obstacle target
                    const modifiedObstacleMap = o.map(line => line.map(cell => ""+cell));
                    modifiedObstacleMap[target.y][target.x] = '#';

                    const movementMapCopy = m.map(l => l.map(c => {
                        return {...c};
                    }));
                    const dirKey = this.getKeyFromDirection(g.facing);
                    movementMapCopy[g.pos.y][g.pos.x][dirKey] = false;

                    if (this.simulateGuardPath(
                        g,
                        modifiedObstacleMap,
                        movementMapCopy
                    )) {
                        validPositions++;
                        /*console.log(`Placing at ${target} would create a loop`);
                        console.log(modifiedObstacleMap.map(l => l.join('')).join('\n'));
                        process.exit();*/
                    }


                }

            }
        )


        return validPositions;
    }


    /**
     * Simulate where the guard will be going and return if they end up in a loop
     */
    simulateGuardPath(
        guard: Guard,
        obstacleMap: string[][],
        movementMap: TileFacings[][],
        cellCallback: {(g: Guard, o: string[][], m: TileFacings[][]): void}|undefined = undefined,
    ): boolean {
        const guardPosition = guard.pos.clone();
        const facing = guard.facing.clone();
        
        while (guardPosition.in(this.mapBounds[0], this.mapBounds[1])) {

            const dirKey = this.getKeyFromDirection(facing);
            if (movementMap[guardPosition.y][guardPosition.x][dirKey]) {
                // we were here before! Found a loop!
                return true;
            }
            movementMap[guardPosition.y][guardPosition.x][dirKey] = true;

            // obstacleMap[guardPosition.y][guardPosition.x] = {
            //     up: '^',
            //     down: 'v',
            //     left: '<',
            //     right: '>',
            // }[dirKey];


            if (cellCallback) {
                cellCallback(
                    {
                        pos: guardPosition.clone(),
                        facing: facing.clone(),
                    },
                    obstacleMap,
                    movementMap
                )
            }


            const target = guardPosition.clone().add(facing);

            if (target.in(this.mapBounds[0], this.mapBounds[1]) && obstacleMap[target.y][target.x] === '#') {
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
        
        return false;
    }
    
    getKeyFromDirection(dir: Vector): keyof TileFacings {
        if      (dir.x === 0 && dir.y ===  1) return 'down';
        else if (dir.x === 0 && dir.y === -1) return 'up';
        else if (dir.x ===  1 && dir.y === 0) return 'right';
        else if (dir.x === -1 && dir.y === 0) return 'left';
    }
    
}

// noinspection JSUnusedGlobalSymbols
export default (new Y2024_Day06_2());