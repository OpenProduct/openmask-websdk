import { Cell } from "../../boc/cell";
import HttpProvider from "../../providers/httpProvider";
import { Options } from "../contract";
import { WalletContract } from "./walletContract";
export declare class WalletV4ContractR1 extends WalletContract {
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
