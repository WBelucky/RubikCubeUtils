import { CubeState } from "./cube_state";
import { COCPtoOldPochManuever, EPEOtoM2Manuever, EPEO2StickerName } from "./mapping";
import { getInverseManuever } from "./utils";
import { Vector } from "./vector";


const altYPerm = "R U\' R\' U\' R U R\' F\' R U R\' U\' R\' F R";

export const solveM2AndOldPochmann = (cube: CubeState): string => {
    const m2 = M2Method(cube);
    return m2.maneuver + (m2.parity ? "D\'L2DM2 D\'L2D" : "") + OldPochmann(cube);
        
}

const M2Method = (cube: CubeState): {maneuver: string, parity: boolean}  => {
    let cb = new CubeState(cube);
    let buf = cb.getEOEP(0, 10);
    let retManuevers = "";
    let parityCount = 0;
    let count = 0;
    const OddEP = new Vector([0, 1, 2, 3, 4, 5, 8, 7, 6, 9, 10 ,11]);
    const EvenEP = new Vector([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ,11]);
    const EO = new Vector([0,0,0,0,0 ,0,0,0,0,0 ,0,0]);

    loop: while (true) {
        const fin = (parityCount % 2 === 1 ? cb.ep.equals(OddEP) : cb.ep.equals(EvenEP)) && cb.eo.equals(EO);
        if (fin) break;
        const arr = [10, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11];
        for (const epi of arr) {
            const ep = cb.getEOEP(0, epi).ep;
            const eo = cb.getEOEP(0, epi).eo;
            if (eo !== 0 && epi !== 10) {
                buf = cb.getEOEP(0, epi);
                break;
            }
            if (parityCount % 2 === 1 && ((ep === 6 && epi === 8) || (ep === 8 && epi === 6))) {
                continue
            }
            if (ep !== epi ) {
                buf = cb.getEOEP(0, epi);
                break;
            }
            if (epi === 11) {
                break loop;
            }
        }
        let cnt = 0;
        while(true) {
            const [ep, eo] = ((buf: {eo: number, ep: number}, parityCount: number): [number, number] => {
                if (parityCount %2 === 1) {
                    if (buf.ep === 6 ) {
                        return [8, buf.eo];
                    } else if (buf.ep === 8) {
                        return [6, buf.eo];
                    }
                }
                return [buf.ep, buf.eo];
            })(buf, parityCount)

            const maneuver = EPEOtoM2Manuever[ep][eo];
            const sticker = EPEO2StickerName[ep][eo];
            console.log(sticker, maneuver);

            retManuevers += maneuver;
            cb = cb.applyMoves(maneuver);
            buf = cb.getEOEP(0, 10);
            parityCount++;
            if (buf.ep === 10 ) {
                break;
            }
            if (cnt >= 200) {
                throw new Error('too many operations');
            }
            cnt ++;
        }
        console.log('ループ終了');
        if (count >= 100) {
            console.log(retManuevers);
            throw new Error('too many operations');
        }
        count ++;
    }
    return {maneuver: retManuevers, parity: parityCount % 2 === 1};
};


export const OldPochmann = (cube: CubeState): string => {
    let cb = new CubeState(cube);
    let buf = cb.getCOCP(0, 0);
    let retManuevers = "";
    let parityCount = 0;
    let count = 0;

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
        let cnt = 0;
        while (true) {
            const setup = COCPtoOldPochManuever[buf.cp][buf.co];
            const maneuver = setup + altYPerm + getInverseManuever(setup);
            retManuevers += maneuver;
            cb = cb.applyMoves(maneuver);
            buf = cb.getCOCP(0, 0);
            parityCount++;
            if (buf.cp === 0 ) {
                break;
            }
            if (parityCount >= 20) {
                break;
            }
            if (cnt >= 200) {
                throw new Error("too many operations");
            }
            cnt ++;
        }
        if (parityCount >= 20) {
            break;
        }
        if (count >=200) {
            throw new Error("too many operations");
        }
        count ++;
    }
    return retManuevers;
};