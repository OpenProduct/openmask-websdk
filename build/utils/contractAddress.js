import { Cell } from "../boc/cell";
import Address from "./address";
export class StateInit {
    data;
    code;
    constructor(opts) {
        if (opts.code !== null && opts.code !== undefined) {
            this.code = opts.code;
        }
        else {
            this.code = null;
        }
        if (opts.data !== null && opts.data !== undefined) {
            this.data = opts.data;
        }
        else {
            this.data = null;
        }
    }
    writeTo(cell) {
        cell.bits.writeBit(0); // SplitDepth
        cell.bits.writeBit(0); // TickTock
        cell.bits.writeBit(!!this.code); // Code presence
        cell.bits.writeBit(!!this.data); // Data presence
        cell.bits.writeBit(0); // Library
        if (this.code) {
            cell.refs.push(this.code);
        }
        if (this.data) {
            cell.refs.push(this.data);
        }
    }
}
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
