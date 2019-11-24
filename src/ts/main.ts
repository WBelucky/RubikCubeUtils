
import * as PIXI from "pixi.js";
import { CubeState, fundamentalMoveNames} from "./cube_state";
import { KeyboardHandler, KeyCode } from "./keyboard_handler";
import { CubeCanvas } from "./cube_canvas";
import { interactionSetting } from "./interaction_setting";



const main = () => {

    const app = new PIXI.Application({ width: 640, height: 480 });

    document.body.appendChild(app.view);

    let cube = new CubeState();

    const cubeCanvas = new CubeCanvas(cube);
    app.stage.addChild(cubeCanvas);

    let keyboardIsOn = false
    interactionSetting(cubeCanvas, cube, keyboardIsOn);

    const keyboard = new KeyboardHandler();
    app.ticker.add(() => {
        keyboard.update();
        if (keyboardIsOn) {
            for (const face of fundamentalMoveNames) {
                if (! keyboard.isKeyJustDown.get(("Key" + face) as KeyCode) ) {
                    continue;
                }
                if (keyboard.isKeyDown.get("ShiftLeft") || keyboard.isKeyDown.get("ShiftRight")) {
                    cube = cube.applyMoves(face + "\'")
                    cubeCanvas.draw(cube);
                } else {
                    cube = cube.applyMoves(face)
                    cubeCanvas.draw(cube);
                }
            }
        }
    });
}

main();