import { Cell } from "../../boc/cell";
import HttpProvider from "../../providers/httpProvider";
import { Options } from "../contract";
import { WalletContract } from "./walletContract";
export declare class WalletV4ContractR1 extends WalletContract {
    constructor(provider: HttpProvider, options: Options);
    getName(): string;
    /**
     * @override
     * @private
     * @param   seqno?   {number}
     * @param   withoutOp? {boolean}
     * @return {Cell}
     */
    protected createSigningMessage(seqno?: number, withoutOp?: boolean): Cell;
    /**
     * @override
     * @return {Cell} cell contains wallet data
     */
    protected createDataCell(): Cell;
    /**
     * @return {Promise<BN>}
     */
    getPublicKey: () => Promise<any>;
}
