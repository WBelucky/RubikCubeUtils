import { CubeState } from "./cube_state";
import { COCPtoOldPochManuever, EPEOtoM2Manuever } from "./mapping";
import { getInverseManuever } from "./utils";


export const solveM2 = (cube: CubeState): string => {
    let cb = new CubeState(cube);
    let buf = cb.getEOEP(0, 10);
    let retManuevers = "";
    let parityCount = 0;

    while (!cb.ep.equals(new CubeState().ep) ) {
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


export const OldPochmann = (cube: CubeState): string => {
    const altYPerm = "R U\' R\' U\' R U R\' F\' R U R\' U\' R\' F R";
    let cb = new CubeState(cube);
    let buf = cb.getCOCP(0, 0);
    let retManuevers = "";
    let parityCount = 0;

    while (!cb.cp.equals(new CubeState().cp) || !cb.co.equals(new CubeState().co) ) {
        for (let cpi = 0; cpi < 8; cpi++) {
            const corner =  cb.getCOCP(0, cpi);
            if (corner.cp !== cpi ) {
                buf = corner;
                break;
            }

            if (cpi !== 0 && corner.cp === cpi  && corner.co !== 0) {
                buf = cb.getCOCP(0, cpi);
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