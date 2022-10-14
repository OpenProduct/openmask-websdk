import BN from "bn.js";
import { Cell } from "../../../boc/cell";
import Address from "../../../utils/address";
export declare const jettonBurnBody: (params: {
    queryId?: number;
    jettonAmount: BN;
    responseAddress: Address;
}) => Cell;
export declare const jettonTransferBody: (params: {
    queryId?: number;
    jettonAmount: BN;
    toAddress: Address;
    responseAddress: Address;
    forwardAmount: BN;
    forwardPayload: Uint8Array;
}) => Cell;
