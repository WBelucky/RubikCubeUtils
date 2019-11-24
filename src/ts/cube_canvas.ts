import * as PIXI from "pixi.js";
import { CubeState} from "./cube_state";
import { faceToOAndPs, faceToColor } from "./mapping";
import { getMoveArray } from "./utils";

const blockSizePx = 50 as const;

export class CubeCanvas extends PIXI.Graphics {
    constructor(cube: CubeState) {
        super();
        this.draw(cube);
    }
    public draw(cube: CubeState): void {
        this.clear();
        const spacePx = 10;
        const tmp = spacePx + blockSizePx * 3;
        this.faceDraw(cube, "U", tmp, 0);
        this.faceDraw(cube, "D", tmp, 2 * tmp);
        this.faceDraw(cube, "F", tmp, tmp);
        this.faceDraw(cube, "B", 3 * tmp , tmp);
        this.faceDraw(cube, "R", 2 * tmp, tmp);
        this.faceDraw(cube, "L", 0, tmp);
    }

    private faceDraw(cube: CubeState, s: string, x: number, y: number): void {
        let faceId: string | null = null;
        for (let i = 0; i < 3; i++ ) {
            for (let j = 0; j < 3; j++ ) {
                const blockIndex = 3 * i + j;
                if ( i === 1 && j === 1 ) {
                    faceId = cube.getFaceOfCenter(s);
                } else if ( ( i + j ) % 2 === 0) {
                    faceId = cube.getFaceOfCorner(faceToOAndPs[s][blockIndex][1] , faceToOAndPs[s][blockIndex][0]);
                } else {
                    faceId = cube.getFaceOfEdge(faceToOAndPs[s][blockIndex][1] , faceToOAndPs[s][blockIndex][0]);
                }
                this.beginFill(faceToColor[faceId]);
                this.lineStyle(5);
                this.drawRect(x + j * blockSizePx, y + i * blockSizePx, blockSizePx, blockSizePx);
            }
        }
    }

    public async moveSequeitially(cube: CubeState, maneuver: string, interval: number): Promise<void> {
        const motions = getMoveArray(maneuver);
        if (motions == null) {
            return;
        }
        let i = 0;
        for (const motion of motions) {
            cube = cube.applyMoves(motion);
            this.draw(cube);
            await sleep(300);
        }
    }
};

const sleep = (time: number) => {
    return new Promise((res) => {
        setTimeout(() => {
           res(); 
        }, time);
    })
}