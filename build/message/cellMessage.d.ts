import { Cell } from "../boc/cell";
import { Message } from "./message";
export declare class CellMessage implements Message {
    private cell;
    constructor(cell: Cell);
    writeTo(cell: Cell): void;
}
