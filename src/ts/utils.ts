
export const sleep = (time: number) => {
    return new Promise((res) => {
        setTimeout(() => {
           res(); 
        }, time);
    })
}

export const getInverseManuever = (manu: string): string => {
    let retManuever = "";
    const motionArray = getMoveArray(manu);
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

export const getMoveArray = (manuerver: string): RegExpMatchArray | null => {
    const retMoveArray = manuerver.match(/[FBUDRLXYZMES](\'|2)?/g);
    if (retMoveArray === null) {
        return null;
    }
    return retMoveArray;
}
