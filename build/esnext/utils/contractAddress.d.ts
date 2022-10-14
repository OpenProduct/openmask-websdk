import { Cell } from "../boc/cell";
import Address from "./address";
export declare function contractAddress(source: {
    workchain: number;
    initialCode: Cell;
    initialData: Cell;
}): Promise<Address>;
