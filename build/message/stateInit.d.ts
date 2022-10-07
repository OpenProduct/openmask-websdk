import { Cell } from "../boc/cell";
import { Message } from "./message";
export declare class StateInit implements Message {
    readonly data: Cell | null;
    readonly code: Cell | null;
    constructor(opts: {
        code?: Cell;
        data?: Cell;
    });
    writeTo(cell: Cell): void;
}
