export class Vector {
    public readonly length: number;
    private elements: number[];

    constructor(a: number[]);
// tslint:disable-next-line: unified-signatures
    constructor(n: number);
// tslint:disable-next-line: unified-signatures
    constructor(v: Vector)
    constructor(a: unknown) {
        if (typeof a === "number") {
            this.length = a;
            this.elements = new Array<number>(a);
            for (let i = 0; i < this.length; i++) {
                this.elements[i] = 0;
            }
            return;
        }
        if (a instanceof Array) {
            this.length = a.length;
            this.elements = a;
            return;
        }
        if (a instanceof Vector) {
            this.length = a.length;
            this.elements = new Array<number>(this.length);
            for (let i = 0; i < a.length; i++) {
                this.elements[i] = a.at(i);
            }
            return;
        }
        throw new Error("Invalid type of arguments");
    }

    public at(i: number): number {
        return this.elements[i];
    }

    public set(i: number, value: number): void {
        if (i < 0 || i >= this.length) {
            throw new Error("you cannot access the area");
        }
        this.elements[i] = value;
    }

    public map(func: (e: number) => number): Vector {
        const a: Vector = new Vector(this.elements.map(func));
        return a;
    }

    public add(b: Vector): Vector;
// tslint:disable-next-line: unified-signatures
    public add(b: number[]): Vector;
    public add(b: unknown): Vector {
        if (b instanceof Vector) {

            if (b.length !== this.length) {
                throw new Error("the number of elements are not same");
            }
            const a: number[] = this.elements.concat();
            for (let i = 0; i < this.length; i++) {
                a[i] += b.at(i);
            }
            return new Vector(a);
        }
        if (b instanceof Array) {
            if (b.length !== this.length) {
                throw new Error("the number of elements are not same");
            }
            const a: number[] = this.elements.concat();
            for (let i = 0; i < this.length; i++) {
                a[i] += b[i];
            }
            return new Vector(a);
        }
        throw new Error("invalid type of argument");
    }

    public mul(c: number): Vector {
        const a = new Vector(this);
        return a.map((e: number) => e * c);
    }
    public div(c: number) {
        if (c === 0) {
            throw new Error("do not divide with 0");
        }
        const a = new Vector(this);
        return a.map((e: number) => e / c);
    }

    public mod(c: number) {
        if (c === 0) {
            throw new Error("do not mod with 0");
        }
        const a = new Vector(this);
        return a.map((e: number): number => e % c);
    }

    // indexを入れ込むみたいなことをする python(numpy)の[]演算子みたいな感じ
    public apply_move(move: Vector): Vector {
        const ret: Vector = new Vector(this);
        if (ret.length !== move.length) {
            throw new Error("the number of elements are not same");
        }
        for (let i = 0; i < this.length; i++) {
            ret.set(i, this.at(move.at(i)));
        }
        return ret;
    }

    public each_is_in_limitation(end: number): boolean {
        let isOk = true;
        for (let i = 0; i < this.length; i++) {
            if (this.elements[i] >= end) {
                isOk = false;
            }
        }
        return isOk;
    }

    public equals(v: Vector): boolean {
        if (v.length !== this.length) {
            return false;
        }
        for (let i = 0; i < v.length; i++) {
           if (v.at(i) !== this.elements[i]) {
               return false;
           }
        }
        return true;
    }

    public info(): void {
        console.log(this.elements);
    }
}

const TestVector = (): void => {
    const a = new Vector([1, 2, 3]);
    const b = new Vector([4, 5, 6]);

// tslint:disable-next-line: no-console
    console.log(a.at(2));
    console.log(a.length);
    const v = a.add(b).mul(3).mod(4);
    console.log(v);
    console.log(a);
    console.log(new Vector(3));
    console.log(a.add([1, 2, 3]));
    let self = new Vector([0, 1, 2, 3, 4, 5, 6, 7]);
    const move = new Vector([0, 2, 6, 3, 4, 1, 5, 7]);
    self = self.apply_move(move);
    console.log(self);
};
