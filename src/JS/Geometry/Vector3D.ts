export default class Vector3D {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    toString(): string {
        return `[${this.x},${this.y}, ${this.z}]`;
    }

    set(x: number, y: number, z: number): Vector3D {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    pull(v: Vector3D): Vector3D {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }

    add(v: Vector3D): Vector3D {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    sub(v: Vector3D): Vector3D {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    mul(v: Vector3D): Vector3D {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        return this;
    }

    div(v: Vector3D): Vector3D {
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;
        return this;
    }

    invert(): Vector3D {
        return this.scale(-1);
    }

    scale(n: number): Vector3D {
        this.x *= n;
        this.y *= n;
        this.z *= n;
        return this;
    }

    scalar(): number {
        return (this.x * this.x) + (this.y * this.y) + (this.z * this.z);
    }

    /**
     * In a Euclidean space, this is equal to the distance between two points
     */
    norm(): number {
        return Math.sqrt(this.scalar());
    }

    cross(v: Vector3D): Vector3D {
        const c1 = (this.y * v.z) - (this.z * v.y);
        const c2 = (this.z * v.x) - (this.x * v.z);
        const c3 = (this.x * v.y) - (this.y * v.x);
        return new Vector3D(c1, c2, c3);
    }

    dist(v: Vector3D): number {
        return Math.sqrt(this.distSqr(v));
    }

    distSqr(v: Vector3D): number {
        return Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2) + Math.pow(this.z - v.z, 2);
    }

    normalize(): Vector3D {
        if (this.x === 0 && this.y === 0 && this.z === 0) return this;
        return this.scale(1/this.norm());
    }

    equals(v: Vector3D): boolean {
        return (this.x === v.x) && (this.y === v.y) && (this.z === v.z);
    }

    equalsRaw(x: number, y: number, z: number): boolean {
        return (this.x === x) && (this.y === y) && (this.z === z);
    }

    clone(): Vector3D {
        return new Vector3D(this.x, this.y, this.z);
    }

    static create(x: number, y: number, z: number): Vector3D {
        return new Vector3D(x,y,z);
    }

    between(v1: Vector3D, v2: Vector3D): boolean {
        return (
            this.x > Math.min(v1.x, v2.x) &&
            this.x < Math.max(v1.x, v2.x) &&
            this.y > Math.min(v1.y, v2.y) &&
            this.y < Math.max(v1.y, v2.y) &&
            this.z > Math.min(v1.z, v2.z) &&
            this.z < Math.max(v1.z, v2.z)
        );
    }

    in(v1: Vector3D, v2: Vector3D): boolean {
        return (
            this.x >= Math.min(v1.x, v2.x) &&
            this.x <= Math.max(v1.x, v2.x) &&
            this.y >= Math.min(v1.y, v2.y) &&
            this.y <= Math.max(v1.y, v2.y) &&
            this.z >= Math.min(v1.z, v2.z) &&
            this.z <= Math.max(v1.z, v2.z)
        );
    }
}