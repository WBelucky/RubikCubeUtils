import { Vector } from "./vector";

export class CubeState {
    public static solved = new CubeState(
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 2, 3, 4, 5, 6, 7],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    );
    public static getMoveArray(manuerver: string): RegExpMatchArray | null {
        const retMoveArray = manuerver.match(/[FBUDRLXYZMES](\'|2)?/g);
        if (retMoveArray === null) {
            return null;
        }
        return retMoveArray;
    }
    public co: Vector;
    public cp: Vector;
    public eo: Vector;
    public ep: Vector;
    public centerPermutation: Vector = new Vector([0, 1, 2, 3, 4, 5]);
    public normarized: CubeState = this;

    constructor(cubeState: CubeState);
    constructor(co: number[], cp: number[], eo: number[], ep: number[], centerP?: number[]);
    constructor(co: Vector, cp: Vector, eo: Vector, ep: Vector, centerP?: Vector);
    constructor(co: unknown, cp?: unknown, eo?: unknown, ep?: unknown, centerP?: unknown) {
        if (co instanceof CubeState) {
            this.co = new Vector(co.co);
            this.cp = new Vector(co.cp);
            this.eo = new Vector(co.eo);
            this.ep = new Vector(co.ep);
            this.centerPermutation = new Vector(co.centerPermutation);
            return;
        }

        if (co instanceof Vector && cp instanceof Vector && eo instanceof Vector && ep instanceof Vector) {
            if (co.length !== 8 || cp.length !== 8 || eo.length !== 12 || ep.length !== 12) {
                throw new Error("the number of corners should be 8,and the number of edges should be 12");
            }
            this.co = co;
            this.cp = cp;
            this.eo = eo;
            this.ep = ep;
            if (centerP != null && centerP instanceof Vector) {
                this.centerPermutation = centerP;
            }
            return;
        }

        if (co instanceof Array && cp instanceof Array && eo instanceof Array && ep instanceof Array) {
            if (co.length !== 8 || cp.length !== 8 || eo.length !== 12 || ep.length !== 12) {
                throw new Error("the number of corners should be 8,and the number of edges should be 12");
            }
            this.co = new Vector(co);
            this.cp = new Vector(cp);
            this.eo = new Vector(eo);
            this.ep = new Vector(ep);
            if (centerP != null && centerP instanceof Array) {
                this.centerPermutation = new Vector(centerP);
            }
            return;
        }
        throw new Error("えらった");
    }

    public applyMove(move: CubeState): CubeState;
    // tslint:disable-next-line: unified-signatures
    public applyMove(move: string): CubeState;
    public applyMove(move: unknown): CubeState {
        if (typeof move === "string") {
            return this.applyMove(moves[move]);
        }
        if (move instanceof CubeState) {
            const newCo: Vector = this.co.apply_move(move.cp).add(move.co).mod(3);
            const newCp: Vector = this.cp.apply_move(move.cp);
            const newEo: Vector = this.eo.apply_move(move.ep).add(move.eo).mod(2);
            const newEp: Vector = this.ep.apply_move(move.ep);
            const newCenterPermutation: Vector = this.centerPermutation.apply_move(move.centerPermutation);
            return new CubeState(newCo, newCp, newEo, newEp, newCenterPermutation);
        }
        throw new Error("Inavlid type of argument: string or CubeState");
    }
    public applyMoves(moveStr: string): CubeState {
        const moveArray = CubeState.getMoveArray(moveStr);
        let retState = new CubeState(this);
        if (moveArray == null) {
            return this;
        }
        for (const mo of moveArray) {
            retState = retState.applyMove(mo);
        }
        return retState;
    }

    // eoとepからその面の値を返す
    public getFaceOfCorner(co: number, cp: number): string {
        if (co >= 3 || co < 0 || cp < 0 || cp >= 8) {
            throw new Error("cpは8未満,coは3未満の整数で頼んます");
        }
        return cornerNames[this.cp.at(cp)].charAt((- this.co.at(cp) + 3 + co) % 3);
    }
    // coとcpからその面の値を返す
    public getFaceOfEdge(eo: number, ep: number): string {
        if (eo >= 2 || eo < 0 || ep < 0 || ep >= 12) {
            throw new Error("epは12未満,eoは2未満の整数で頼んます");
        }
        return edgeNames[this.ep.at(ep)].charAt((this.eo.at(ep) + eo) % 2);
    }
    public getFaceOfCenter(centerP: string): string {
        let i = 0;
        for (const face of faces) {
            if (face === centerP) {
                break;
            }
            i++;
        }
        return faces[this.centerPermutation.at(i)];
    }
    // coとcpが示す位置のcoとcpを返す.
    public getCOCP(co: number, cp: number): { co: number, cp: number } {
        if (co >= 3 || co < 0 || cp < 0 || cp >= 8) {
            throw new Error("cpは8未満,coは3未満の整数で頼んます");
        }
        return { co: (- this.co.at(cp) + 3 + co) % 3, cp: this.cp.at(cp) };
    }
    //eoとepが示す位置のeoとepを返す
    public getEOEP(eo: number, ep: number): { eo: number, ep: number } {
        if (eo >= 2 || eo < 0 || ep < 0 || ep >= 12) {
            throw new Error("epは12未満,eoは2未満の整数で頼んます");
        }
        return { eo: (this.eo.at(ep) + eo) % 2, ep: this.ep.at(ep) };
    }
    public info(): void {
        this.co.info();
        this.cp.info();
        this.eo.info();
        this.ep.info();
    }

}

const cornerNames = [
    "ULB",
    "UBR",
    "URF",
    "UFL",
    "DBL",
    "DRB",
    "DFR",
    "DLF",
] as const;
const edgeNames = [
    "BL",
    "BR",
    "FR",
    "FL",
    "UB",
    "UR",
    "UF",
    "UL",
    "DB",
    "DR",
    "DF",
    "DL",
] as const;

export const moves: { [key: string]: CubeState } = {
    R: new CubeState(
        [0, 1, 2, 0, 0, 2, 1, 0],
        [0, 2, 6, 3, 4, 1, 5, 7],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 5, 9, 3, 4, 2, 6, 7, 8, 1, 10, 11]
    ),
    L: new CubeState(
        [2, 0, 0, 1, 1, 0, 0, 2],
        [4, 1, 2, 0, 7, 5, 6, 3],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [11, 1, 2, 7, 4, 5, 6, 0, 8, 9, 10, 3],
    ),
    U: new CubeState(
        [0, 0, 0, 0, 0, 0, 0, 0],
        [3, 0, 1, 2, 4, 5, 6, 7],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 2, 3, 7, 4, 5, 6, 8, 9, 10, 11],
    ),
    D: new CubeState(
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 2, 3, 5, 6, 7, 4],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 8],
    ),
    F: new CubeState(
        [0, 0, 1, 2, 0, 0, 2, 1],
        [0, 1, 3, 7, 4, 5, 2, 6],
        [0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0],
        [0, 1, 6, 10, 4, 5, 3, 7, 8, 9, 2, 11],
    ),
    B: new CubeState(
        [1, 2, 0, 0, 2, 1, 0, 0],
        [1, 5, 2, 3, 0, 4, 6, 7],
        [1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        [4, 8, 2, 3, 1, 5, 6, 7, 0, 9, 10, 11],
    ),
    X: new CubeState(
        [2, 1, 2, 1, 1, 2, 1, 2],
        [3, 2, 6, 7, 0, 1, 5, 4],
        [0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [7, 5, 9, 11, 6, 2, 10, 3, 4, 1, 8, 0],
        [3, 0, 2, 5, 4, 1],
    ),
    Y: new CubeState(
        [0, 0, 0, 0, 0, 0, 0, 0],
        [3, 0, 1, 2, 7, 4, 5, 6],
        [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [3, 0, 1, 2, 7, 4, 5, 6, 11, 8, 9, 10],
        [0, 4, 1, 2, 3, 5],
    ),
    Z: new CubeState(
        [1, 2, 1, 2, 2, 1, 2, 1],
        [4, 0, 3, 7, 5, 1, 2, 6],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [8, 4, 6, 10, 0, 7, 3, 11, 1, 5, 2, 9],
        [4, 1, 0, 3, 5, 2],
    ),
};

export const faces = ["U", "B", "R", "F", "L", "D"] as const;
export const fundamentalMoveNames = Object.keys(moves);
export const moveName: string[] = [];
const addMove = (...moveNames: string[]): void => {
    for (const face of moveNames) {
        moveName.push(face, "\'" + face, face + "2");
        moves[face + "2"] = moves[face].applyMove(moves[face]);
        moves[face + "\'"] = moves[face + "2"].applyMove(moves[face]);
    }
};
addMove(...fundamentalMoveNames);
moves.M = CubeState.solved.applyMoves("RL\'X\'");
moves.E = CubeState.solved.applyMoves("UD\'Y\'");
moves.S = CubeState.solved.applyMoves("FB\'Z\'");
fundamentalMoveNames.push("M", "E", "S");
addMove("M", "E", "S");

let regexName = "";
for (const name of Object.keys(moves)) {
    regexName += name;
}
