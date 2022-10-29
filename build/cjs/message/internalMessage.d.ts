import BN from "bn.js";
import { Cell } from "../boc/cell";
import { Address } from "../utils/address";
import { CommonMessageInfo } from "./commonMessageInfo";
import { Message } from "./message";
export declare class InternalMessage implements Message {
    readonly from: Address | null;
    readonly to: Address;
    readonly value: BN;
    readonly ihrDisabled: boolean;
    readonly bounce: boolean;
    readonly bounced: boolean;
    readonly ihrFees: BN;
    readonly fwdFees: BN;
    readonly createdAt: BN;
    readonly createdLt: BN;
    readonly body: CommonMessageInfo;
    constructor(opts: {
        to: Address;
        value: number | BN;
        bounce: boolean;
        ihrFees?: number | BN;
        fwdFees?: number | BN;
        createdLt?: number | BN;
        createdAt?: number;
        ihrDisabled?: boolean;
        bounced?: boolean;
        from?: Address;
        body: CommonMessageInfo;
    });
    writeTo(cell: Cell): void;
}
