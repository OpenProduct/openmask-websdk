/// <reference types="bn.js" />
import { Cell } from "../../../boc/cell";
import TonHttpProvider from "../../../providers/httpProvider";
import Address from "../../../utils/address";
import { Contract } from "../../contract";
export interface JettonWalletOptions {
    address?: Address | string;
    code?: Cell;
    wc?: number;
}
export declare class JettonWallet extends Contract {
    /**
     * @param provider
     * @param options   {{address?: Address | string, code?: Cell}}
     */
    constructor(provider: TonHttpProvider, options: JettonWalletOptions);
    createTransferBody: (params: {
        queryId?: number | undefined;
        jettonAmount: import("bn.js");
        toAddress: Address;
        responseAddress: Address;
        forwardAmount: import("bn.js");
        forwardPayload: Uint8Array;
    }) => Cell;
    createBurnBody: (params: {
        queryId?: number | undefined;
        jettonAmount: import("bn.js");
        responseAddress: Address;
    }) => Cell;
    getData(): Promise<import("./jettonWalletDao").JettonWalletData>;
}
