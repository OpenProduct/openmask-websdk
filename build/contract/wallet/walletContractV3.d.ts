import { Cell } from "../../boc/cell";
import HttpProvider from "../../providers/httpProvider";
import { Options } from "../contract";
import { WalletContract } from "./walletContract";
declare class WalletV3ContractBase extends WalletContract {
    /**
     * @override
     * @private
     * @param   seqno?   {number}
     * @return {Cell}
     */
    createSigningMessage(seqno?: number): Cell;
    /**
     * @override
     * @return {Cell} cell contains wallet data
     */
    createDataCell(): Cell;
}
export declare class WalletV3ContractR1 extends WalletV3ContractBase {
    /**
     * @param provider    {HttpProvider}
     * @param options {any}
     */
    constructor(provider: HttpProvider, options: Options);
    getName(): string;
}
export declare class WalletV3ContractR2 extends WalletV3ContractBase {
    /**
     * @param provider    {HttpProvider}
     * @param options {any}
     */
    constructor(provider: HttpProvider, options: Options);
    getName(): string;
}
export {};
