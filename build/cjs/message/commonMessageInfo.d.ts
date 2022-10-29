import { Cell } from "../boc/cell";
import { Message } from "./message";
export declare class CommonMessageInfo implements Message {
    readonly stateInit: Message | null;
    readonly body: Message | null;
    constructor(opts?: {
        stateInit?: Message;
        body?: Message;
    });
    writeTo(cell: Cell): void;
}
