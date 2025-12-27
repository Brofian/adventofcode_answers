import Vector from "./Vector";

export default class Edge {
    readonly start: Vector;
    readonly end: Vector;
    readonly min: Vector;
    readonly max: Vector;
    private lengthSqrCache: undefined|number = undefined;

    constructor(start: Vector, end: Vector) {
        this.start = start;
        this.end = end;
        this.min = Vector.create(Math.min(start.x, end.x), Math.min(start.y, end.y))
        this.max = Vector.create(Math.max(start.x, end.x), Math.max(start.y, end.y))
    }

    lengthSqr(): number {
        if (this.lengthSqrCache === undefined) {
            this.lengthSqrCache = Math.pow((this.max.x - this.min.x), 2) + (this.max.y - this.min.y);
        }
        return this.lengthSqrCache;
    }

    isVertical(): boolean {
        return this.start.x === this.end.x;
    }

    isHorizontal(): boolean {
        return this.start.y === this.end.y;
    }

    isAxisAligned(): boolean {
        return this.isHorizontal() || this.isVertical();
    }

    containsPoint(p: Vector): boolean {
        return (
            p.x >= this.min.x &&
            p.x <= this.max.x &&
            p.y >= this.min.y &&
            p.y <= this.max.y
        );
    }

    getIntersection(other: Edge): Vector | undefined {
        const distances = this.getIntersectionDistances(other);
        if (!distances) return undefined;

        const [uA, uB] = distances;

        // Intersection exists only if both parameters lie within [0,1]
        if (uA < 0 || uA > 1 || uB < 0 || uB > 1) {
            return undefined;
        }

        const ix = this.start.x + uA * (this.end.x - this.start.x);
        const iy = this.start.y + uA * (this.end.y - this.start.y);
        return Vector.create(ix, iy);
    }


    getIntersectionDistances(other: Edge): [number, number]|undefined {
        const x1 = this.start.x;
        const y1 = this.start.y;
        const x2 = this.end.x;
        const y2 = this.end.y;
        const x3 = other.start.x;
        const y3 = other.start.y;
        const x4 = other.end.x;
        const y4 = other.end.y;

        const divisor = (y4-y3)*(x2-x1) - (x4-x3)*(y2-y1);
        if (divisor === 0 || !Number.isFinite(divisor) || Number.isNaN(divisor)) {
            return undefined;
        }

        const uADividend = (x4-x3)*(y1-y3) - (y4-y3)*(x1-x3);
        const uBDividend = (x2-x1)*(y1-y3) - (y2-y1)*(x1-x3);
        const uA = uADividend / divisor;
        const uB = uBDividend / divisor;

        return [uA,uB];
    }

    toString(): string {
        return `[${this.start} - ${this.end}]`;
    }

    static create(start: Vector, end: Vector): Edge {
        return new Edge(start,end);
    }
}