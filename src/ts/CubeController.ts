import * as PIXI from "pixi.js";
import { CubeState, faces, fundamentalMoveNames} from "./CubeState";
import { KeyboardHandler } from "./keyboard_handler";

const app = new PIXI.Application({ width: 640, height: 480 });

document.body.appendChild(app.view);

const graphics = new PIXI.Graphics();

app.stage.addChild(graphics);

let cube = CubeState.solved;

const setFunctionToTheBtn = (btnName: string, func: () => void) => {
    const btnHtmlElement = document.getElementById(btnName) as HTMLElement;
    if ( btnHtmlElement == null) {
        throw new Error("cannot find html element named " + btnName);
    }
    btnHtmlElement.addEventListener("click", func);
};

const form = document.getElementById("cubeMotionInputWithSentence") as HTMLInputElement;
setFunctionToTheBtn("applyScramble", () => {
    moveSequentialy(form.value, 500);
});

let keyboardIsOn = false;
const toggleKeyboardBtnName = "toggleKeyboard";
const toggleKeyboardBtn = document.getElementById(toggleKeyboardBtnName) as HTMLElement;
if ( toggleKeyboardBtn == null) {
    throw new Error("cannot find html element named" + toggleKeyboardBtnName);
}
toggleKeyboardBtn.addEventListener("click", () => {
    keyboardIsOn = !keyboardIsOn;
    toggleKeyboardBtn.innerHTML = keyboardIsOn ? "keyboard: on" : "keyboard: off";
});

setFunctionToTheBtn("resetBtn", () => {
    cube = CubeState.solved;
    drawCube();
});

const output = document.getElementById("solveOutput") as HTMLElement;
if (output === null) {
    throw new Error("cannotfind the name outputSolve");
}
setFunctionToTheBtn("solveBtn", () => {
    const maneuver = solveM2() + OldPochmann();
    moveSequentialy(maneuver, 200);
    output.innerHTML = maneuver;
});

setFunctionToTheBtn("inverseBtn", () => {
    output.innerHTML = getInverseManuever(form.value);
    form.value = "";
});

const btn: {[key: string]: HTMLElement} = {};
for (const face of faces) {
    btn[face] = document.getElementById(face) as HTMLElement;
    if (btn[face] != null) {
        btn[face].addEventListener("click", () => {
            applyMoveAndDisplay(face);
        });
    }
}

const blockSizePx = 50 as const;
const faceToColor: { [key: string]: number} = {
    R: 0xFF0000,
    L: 0xFF7F50,
    F: 0x228b22,
    B: 0x0000ff,
    U: 0xffffff,
    D: 0xffff00,
};
const faceToOAndPs: { [key: string]: number[][]} = {
    F: [[3, 1], [6, 1], [2, 2],
        [3, 0], [0, 0], [2, 0],
        [7, 2], [10, 1], [6, 1]],
    B: [[1, 1], [4, 1], [0, 2],
        [1, 0], [0, 0], [0, 0],
        [5, 2], [8, 1], [4, 1]],
    R: [[2, 1], [5, 1], [1, 2],
        [2, 1], [0, 0], [1, 1],
        [6, 2], [9, 1], [5, 1]],
    L: [[0, 1], [7, 1], [3, 2],
        [0, 1], [0, 0], [3, 1],
        [4, 2], [11, 1], [7, 1]],
    U: [[0, 0], [4, 0], [1, 0],
        [7, 0], [0, 0], [5, 0],
        [3, 0], [6, 0], [2, 0]],
    D: [[7, 0], [10, 0], [6, 0],
        [11, 0], [0, 0], [9, 0],
        [4, 0], [8, 0], [5, 0]],
};

const faceDraw = (s: string, x: number, y: number): void => {
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
            graphics.beginFill(faceToColor[faceId]);
            graphics.lineStyle(5);
            graphics.drawRect(x + j * blockSizePx, y + i * blockSizePx, blockSizePx, blockSizePx);
        }
    }
};

const drawCube = (): void => {
    graphics.clear();
    const spacePx = 10;
    const tmp = spacePx + blockSizePx * 3;
    faceDraw("U", tmp, 0);
    faceDraw("D", tmp, 2 * tmp);
    faceDraw("F", tmp, tmp);
    faceDraw("B", 3 * tmp , tmp);
    faceDraw("R", 2 * tmp, tmp);
    faceDraw("L", 0, tmp);

};
const applyMoveAndDisplay = (moveName: string): void => {
    cube = cube.applyMoves(moveName);
    drawCube();
};
const moveSequentialy = (maneuver: string, interval: number) => {
    const motions = CubeState.getMoveArray(maneuver);
    if (motions == null) {
        return;
    }
    let i = 0;
    const sequence = () => {
        applyMoveAndDisplay(motions[i]);
        if (i >= motions.length - 1) {
            return;
        }
        new Audio("cube.mp3").play();
        i ++;
        setTimeout( sequence , interval);
    };
    sequence();
};

drawCube();
const keyboard = new KeyboardHandler();
app.ticker.add(() => {
    keyboard.update();
    if (keyboardIsOn) {
        for (const face of fundamentalMoveNames) {
            if (! keyboard.isKeyJustDown.get("Key" + face) ) {
                continue;
            }
            if (keyboard.isKeyDown.get("ShiftLeft") || keyboard.isKeyDown.get("ShiftRight")) {
                applyMoveAndDisplay(face + "\'");
            } else {
                applyMoveAndDisplay(face);
            }
        }
    }
});

const EPEO2StickerName = [
    /*0*/
    [
        "ひ", "き"
    ],
    /*1*/
    [
        "せ",
        "て"
    ],
    /*2*/
    [
        "え",
        "ち"
    ],
    /*3*/
    [
        "い", "け"
    ],
    /*4*/
    [
        "す", "ほ"
    ],
    /*5*/
    [
        "せ", "つ"
    ],
    /*6*/
    [
        "そ", "う"
    ],
    /*7*/
    [
        "し", "く"
    ],
    /*8*/
    [
        "の", "ふ"
    ],
    /*9*/
    [
        "ね", "と"
    ],
    /*10*/
    [
        "ぬ", "お",
    ],
    /*11*/
    [
        "に", "こ"
    ],
]

const EPEOtoM2Manuever = [
    /*0*/
    [
        "U\' L U M2 U\' L\' U", // ひ
        "L\' B L B\' M2 B L\' B\' L", // き
    ],
    /*1*/
    [
        "U R\' U\' M2 U R U\'", // せ
        "R B\' R\' B M2 B\' R B R\'", // て
    ],
    /*2*/
    [
        "U R U\' M2 U R\' U\'", // え
        "B\' R2 B M2 B\' R2 B", // ち
    ],
    /*3*/
    [
        "U\' L\' U M2 U\' L U", // い
        "B L2 B\' M2 B L2 B\'", // け
    ],
    /*4*/
    [
        "M2", // す
        "F2 M\' U M\' U M\' U2 M U M U M U2F2 M2", // ほ
    ],
    /*5*/
    [
        "R\' U R U\' M2 U R\' U\' R", // せ
        "B\' R B M2 B\' R\' B", // つ
    ],
    /*6*/
    [
        "U2 M\' U2 M\'", // そ
        "F E R U R\' E\' R U\' R\' F\' M2", // う
    ],
    /*7*/
    [
        "L U\' L\' U M2 U\' L U L\'",
        "B L\' B\' M2 B L B\'",
    ],
    /*8*/
    [
        "M U2 M U2",
        "M2 F R U R\' E R U\' R\' E\' F\'",
    ],
    /*9*/
    [
        "U R2 U\' M2 U R2 U\'",
        "B\' R\' B M2 B\' R B",
    ],
    /*10*/
    [
        "", // なし
        "", // なし
    ],
    /*11*/
    [
        "U\' L2 U M2 U\' L2 U",
        "B L B\' M2 B L\' B\'",
    ],
];

const solveM2 = (): string => {
    let cb = new CubeState(cube);
    let buf = cb.getEOEP(0, 10);
    let retManuevers = "";
    let parityCount = 0;

    while (!cb.ep.equals(CubeState.solved.ep) ) {
        for (let epi = 0; epi < 12; epi++) {
            if (cube.getEOEP(0, epi).ep !== epi ) {
                buf = cb.getEOEP(0, epi);
                break;
            }
        }
        while (true) {
            let maneuver = EPEOtoM2Manuever[buf.ep][buf.eo];
            if (parityCount % 2 === 1 ) {
                if (buf.ep === 6 ) {
                    maneuver = EPEOtoM2Manuever[8][buf.eo];
                } else if (buf.ep === 8) {
                    maneuver = EPEOtoM2Manuever[6][buf.eo];
                }
            }
            retManuevers +=  maneuver;
            console.log(buf);
            console.log(maneuver);
            cb = cb.applyMoves(maneuver);
            buf = cb.getEOEP(0, 10);
            parityCount++;
            if (buf.ep === 10 ) {
                break;
            }
        }
    }
    return retManuevers;
};

const COCPtoOldPochManuever = [
    /*0*/
    [
        "", // なし
        "", // なし
        "", // なし
    ],
    /*1*/
    [
        "RD\'",
        "R\'F",
        "R2",
    ],
    /*2*/
    [
        "F",
        "R\'",
        "R2D\'",
    ],
    /*3*/
    [
        "FR\'",
        "F\'D",
        "F2",
    ],
    /*4*/
    [
        "DF\'",
        "D\'R",
        "D2",
    ],
    /*5*/
    [
        "R2F",
        "R",
        "D\'",
    ],
    /*6*/
    [
        "F\'R\'",
        "DR",
        "", // そのまま
    ],
    /*7*/
    [
        "F\'",
        "D2R",
        "D",
    ],
];

const getInverseManuever = (manu: string): string => {
    let retManuever = "";
    const motionArray = CubeState.getMoveArray(manu);
    if (motionArray === null) {
        return "";
    }
    for (let i = motionArray.length - 1; i >= 0; i--) {
        if (motionArray[i].match(".\'") !== null) {
            retManuever += motionArray[i].charAt(0);
        } else if (motionArray[i].match(".2") !== null) {
            retManuever += motionArray[i];
        } else {
            retManuever += motionArray[i] + "\'";
        }
    }
    return retManuever;
};

const OldPochmann = (): string => {
    const altYPerm = "R U\' R\' U\' R U R\' F\' R U R\' U\' R\' F R";
    let cb = new CubeState(cube);
    let buf = cb.getCOCP(0, 0);
    let retManuevers = "";
    let parityCount = 0;

    while (!cb.cp.equals(CubeState.solved.cp) || !cb.co.equals(CubeState.solved.co) ) {
        for (let cpi = 0; cpi < 8; cpi++) {
            const corner =  cb.getCOCP(0, cpi);
            if (corner.cp !== cpi ) {
                buf = corner;
                break;
            }
            console.log(cpi);
            console.log(corner);

            if (cpi !== 0 && corner.cp === cpi  && corner.co !== 0) {
                buf = cb.getCOCP(0, cpi);
                console.log("kokonikital");
                break;
            }
        }
        while (true) {
            const setup = COCPtoOldPochManuever[buf.cp][buf.co];
            const maneuver = setup + altYPerm + getInverseManuever(setup);
            retManuevers += maneuver;
            console.log(buf);
            console.log(maneuver);
            cb = cb.applyMoves(maneuver);
            buf = cb.getCOCP(0, 0);
            parityCount++;
            if (buf.cp === 0 ) {
                break;
            }
            if (parityCount >= 20) {
                break;
            }
        }
            if (parityCount >= 20) {
                break;
            }
    }
    return retManuevers;

};
