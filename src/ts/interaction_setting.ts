import { CubeCanvas } from "./cube_canvas";
import { CubeState, faces } from "./cube_state";
import { solveM2, OldPochmann } from "./solver";
import { getInverseManuever } from "./utils";

const setFunctionToTheBtn = (btnName: string, func: () => void) => {
    const btnHtmlElement = document.getElementById(btnName) as HTMLElement;
    if ( btnHtmlElement == null) {
        throw new Error("cannot find html element named " + btnName);
    }
    btnHtmlElement.addEventListener("click", func);
};

export const interactionSetting = (cubeCanvas: CubeCanvas, cube: CubeState, keyboardIsOn: boolean) => {
    const form = document.getElementById("cubeMotionInputWithSentence") as HTMLInputElement;
    setFunctionToTheBtn("applyScramble", () => {
        cubeCanvas.moveSequeitially(cube, form.value, 500);
    });

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
        cube = new CubeState();
        cubeCanvas.draw(cube);
    });
    const output = document.getElementById("solveOutput") as HTMLElement;
    if (output === null) {
        throw new Error("cannotfind the name outputSolve");
    }

    setFunctionToTheBtn("solveBtn", () => {
        const maneuver = solveM2(cube) + OldPochmann(cube);
        cubeCanvas.moveSequeitially(cube, maneuver, 200);
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
                cube = cube.applyMoves(face);
            });
        }
    }
}