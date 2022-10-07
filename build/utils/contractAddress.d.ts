import { Cell } from "../boc/cell";
import Address from "./address";
export declare class StateInit {
    readonly data: Cell | null;
    readonly code: Cell | null;
    constructor(opts: {
        code?: Cell;
        data?: Cell;
    });
    writeTo(cell: Cell): void;
}
export declare function contractAddress(source: {
    workchain: number;
    initialCode: Cell;
    initialData: Cell;
}): Promise<Address>;
