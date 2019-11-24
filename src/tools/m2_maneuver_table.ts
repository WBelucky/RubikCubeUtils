import * as fs from 'fs'
import { EPEOtoM2Manuever, EPEO2StickerName } from '../ts/mapping'

const data = (() => {
    let array = []
    for (let i = 0; i < 12; i++) {
        for (let j = 0; j < 2; j++) {
            array.push(`${EPEO2StickerName[i][j]}: ${EPEOtoM2Manuever[i][j]}`);
        }
    }
    return array;
})().sort().join("\n");
fs.writeFile("./dist/M2.txt", data , (err) => { if (err) throw err});