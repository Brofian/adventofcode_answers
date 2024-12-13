export default class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    toString(): string {
        return `[${this.x},${this.y}]`;
    }

    set(x: number, y: number): Vector {
        this.x = x;
        this.y = y;
        return this;
    }

    pull(v: Vector): Vector {
        this.x = v.x;
        this.y = v.y;
        return this;
    }

    add(v: Vector): Vector {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    addRaw(x: number, y: number): Vector {
        this.x += x;
        this.y += y;
        return this;
    }

    sub(v: Vector): Vector {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    mul(v: Vector): Vector {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    }

    div(v: Vector): Vector {
        this.x /= v.x;
        this.y /= v.y;
        return this;
    }

    invert(): Vector {
        return this.scale(-1);
    }

    scale(n: number): Vector {
        this.x *= n;
        this.y *= n;
        return this;
    }

    scalar(): number {
        return (this.x * this.x) + (this.y * this.y);
    }

    /**
     * In a Euclidean space, this is equal to the distance between two points
     */
    norm(): number {
        return Math.sqrt(this.scalar());
    }

    cross(v: Vector): number {
        return (this.x * v.y) - (this.y * v.x);
    }

    dist(v: Vector): number {
        return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2));
    }

    distSqr(v: Vector): number {
        return Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2);
    }

    normalize(): Vector {
        if (this.x === 0 && this.y === 0) return this;

        return this.scale(1/this.norm());
    }

    equals(v: Vector): boolean {
        return (this.x === v.x) && (this.y === v.y);
    }

    equalsRaw(x: number, y: number): boolean {
        return (this.x === x) && (this.y === y);
    }

    clone(): Vector {
        return new Vector(this.x, this.y);
    }

    static create(x: number, y: number): Vector {
        return new Vector(x,y);
    }

    between(v1: Vector, v2: Vector): boolean {
        return (
            this.x > Math.min(v1.x, v2.x) &&
            this.x < Math.max(v1.x, v2.x) &&
            this.y > Math.min(v1.y, v2.y) &&
            this.y < Math.max(v1.y, v2.y)
        );
    }

    in(v1: Vector, v2: Vector): boolean {
        return (
            this.x >= Math.min(v1.x, v2.x) &&
            this.x <= Math.max(v1.x, v2.x) &&
            this.y >= Math.min(v1.y, v2.y) &&
            this.y <= Math.max(v1.y, v2.y)
        );
    }
}