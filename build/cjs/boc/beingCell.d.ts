/// <reference types="node" />
import BN from "bn.js";
import { Address } from "../utils/address";
import { BitString } from "./bitString";
import { Cell } from "./cell";
export declare class Builder {
    private bits;
    private refs;
    private ended;
    storeRef: (src: Cell) => this;
    storeBit: (value: boolean | number) => this;
    storeBitArray: (value: (boolean | number)[]) => this;
    storeUint: (value: number | BN, bitLength: number) => this;
    storeInt: (value: number | BN, bitLength: number) => this;
    storeUint8: (value: number) => this;
    storeVarUint: (value: number | BN, bitLength: number) => this;
    storeBuffer: (buffer: Buffer) => this;
    storeCoins: (amount: number | BN) => this;
    storeAddress: (address: Address | null) => this;
    storeBitString: (value: BitString) => this;
    storeDict: (src: Cell | null) => this;
    storeRefMaybe: (src: Cell | null) => this;
    storeCellCopy: (src: Cell) => this;
    endCell(): Cell;
}
export declare function beginCell(): Builder;
