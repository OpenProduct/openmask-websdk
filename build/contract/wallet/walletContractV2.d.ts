import { Cell } from "../../boc/cell";
import HttpProvider from "../../providers/httpProvider";
import { Options } from "../contract";
import { WalletContract } from "./walletContract";
export declare class WalletV2ContractBase extends WalletContract {
    /**
     * @override
     * @private
     * @param   seqno?   {number}
     * @return {Cell}
     */
    createSigningMessage(seqno?: number): Cell;
}
export declare class WalletV2ContractR1 extends WalletV2ContractBase {
    /**
     * @param provider    {HttpProvider}
     * @param options? {any}
     */
    constructor(provider: HttpProvider, options: Options);
    getName(): string;
}
export declare class WalletV2ContractR2 extends WalletV2ContractBase {
    /**
     * @param provider    {HttpProvider}
     * @param options? {any}
     */
    constructor(provider: HttpProvider, options: Options);
    getName(): string;
}
