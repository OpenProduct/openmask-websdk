import { Cell } from "../boc/cell";
import { StateInit } from "../message/stateInit";
import Address from "./address";
export async function contractAddress(source) {
    let cell = new Cell();
    let state = new StateInit({
        code: source.initialCode,
        data: source.initialData,
    });
    state.writeTo(cell);
    let hashPart = await cell.hash();
    return new Address({ wc: source.workchain, hashPart });
}
