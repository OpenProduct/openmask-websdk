import BN from "bn.js";
import { Cell } from "../../boc/cell";
import HttpProvider from "../../providers/httpProvider";
import { Options } from "../contract";
import { BaseMethods, WalletContract } from "./walletContract";
export interface WalletV4R1Method extends BaseMethods {
    getPublicKey: () => Promise<BN>;
}
export declare class WalletV4ContractR1 extends WalletContract {
    methods: WalletV4R1Method;
    /**
     * @param provider    {HttpProvider}
     * @param options {any}
     */
    constructor(provider: HttpProvider, options: Options);
    getName(): string;
    /**
     * @override
     * @private
     * @param   seqno?   {number}
     * @param   withoutOp? {boolean}
     * @return {Cell}
     */
    createSigningMessage(seqno?: number, withoutOp?: boolean): Cell;
    /**
     * @override
     * @return {Cell} cell contains wallet data
     */
    createDataCell(): Cell;
    /**
     * @return {Promise<BN>}
     */
    getPublicKey(): Promise<any>;
}
