import Vector from "./Vector";
import Edge from "./Edge";

export default class Rectangle {
    readonly corner1: Vector;
    readonly corner2: Vector;
    readonly tl: Vector;
    readonly tr: Vector;
    readonly bl: Vector;
    readonly br: Vector;
    readonly innerSize: number;
    readonly size: number;
    readonly width: number;
    readonly height: number;

    constructor(corner1: Vector, corner2: Vector) {
        this.corner1 = corner1;
        this.corner2 = corner2;
        const [minX, maxX] = (corner1.x <= corner2.x) ? [corner1.x, corner2.x] : [corner2.x, corner1.x];
        const [minY, maxY] = (corner1.y <= corner2.y) ? [corner1.y, corner2.y] : [corner2.y, corner1.y];
        this.tl = Vector.create(minX, minY);
        this.tr = Vector.create(maxX, minY);
        this.bl = Vector.create(minX, maxY);
        this.br = Vector.create(maxX, maxY);
        this.width = maxX - minX;
        this.height = maxY - minY;
        this.innerSize = this.width * this.height;
        this.size = (this.width + 1) * (this.height + 1);
    }

    shrink(by: number): Rectangle {
        const newCorner1 = this.tl.clone().addRaw(by/2, by/2);
        const newCorner2 = this.br.clone().addRaw(-by/2, -by/2);
        return Rectangle.createAt(newCorner1, newCorner2);
    }

    getCenter(): Vector {
        return Vector.create(
            (this.tl.x + this.br.x) / 2,
            (this.tl.y + this.br.y) / 2
        );
    }

    getCorners(): [Vector,Vector,Vector,Vector] {
        return [ this.tl, this.tr, this.br, this.bl ];
    }

    getEdges(): [Edge,Edge,Edge,Edge] {
        return [
            Edge.create(this.tl, this.tr),
            Edge.create(this.tr, this.br),
            Edge.create(this.br, this.bl),
            Edge.create(this.bl, this.tl),
        ];
    }

    containsPoint(p: Vector): boolean {
        return (
            p.x >= this.tl.x &&
            p.x <= this.br.x &&
            p.y >= this.tl.y &&
            p.y <= this.br.y
        );
    }

    surroundsPoint(p: Vector): boolean {
        return (
            p.x > this.tl.x &&
            p.x < this.br.x &&
            p.y > this.tl.y &&
            p.y < this.br.y
        );
    }

    /**
     * Returns an array of two elements with either the entry/exit point or undefined if none
     *
     * @param line
     */
    isIntersectedByLine(line: Edge): [Vector | undefined, Vector | undefined] {
        const rectEdges = this.getEdges();
        const intersections: { p: Vector, dist: number }[] = [];

        for (const edge of rectEdges) {
            const p = line.getIntersection(edge);
            if (p) {
                intersections.push({
                    p,
                    dist: line.start.distSqr(p)
                });
            }
        }

        // No intersections at all
        if (intersections.length === 0) {
            return [undefined, undefined];
        }

        // Sort by distance from line.start
        intersections.sort((a, b) => a.dist - b.dist);

        // One intersection
        if (intersections.length === 1) {
            const only = intersections[0].p;

            // If line starts inside, this is the exit
            if (this.containsPoint(line.start)) {
                return [undefined, only];
            }

            // Otherwise it's the entry
            return [only, undefined];
        }

        // Two or more intersections → use the first two
        return [intersections[0].p, intersections[1].p];
    }


    toString(): string {
        return `[[${this.corner1} / ${this.corner2}]](${this.size})`;
    }

    static createAt(corner1: Vector, corner2: Vector): Rectangle {
        return new Rectangle(corner1, corner2);
    }
    static createOf(width: number, height: number): Rectangle {
        return new Rectangle(Vector.create(0,0), Vector.create(width, height));
    }
}