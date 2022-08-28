import BN from "bn.js";
import { Cell } from "../boc/cell";
import HttpProvider from "../providers/httpProvider";
import Address from "../utils/address";
export declare type Options = {
    code?: Cell | Uint8Array;
    address?: Address | string;
    wc?: number;
    [key: string]: any;
};
export declare class Contract {
    provider: HttpProvider;
    options: Options;
    address: Address | null;
    methods: Record<string, any>;
    /**
     * @param provider    {HttpProvider}
     * @param options    {{code?: Cell, address?: Address | string, wc?: number}}
     */
    constructor(provider: HttpProvider, options: Options);
    /**
     * @return {Promise<Address>}
     */
    getAddress(): Promise<Address>;
    /**
     * @private
     * @return {Cell} cell contains contact code
     */
    createCodeCell(): Uint8Array | Cell;
    /**
     * Method to override
     * @protected
     * @return {Cell} cell contains contract data
     */
    createDataCell(): Cell;
    /**
     * @protected
     * @return {Promise<{stateInit: Cell, address: Address, code: Cell, data: Cell}>}
     */
    createStateInit(): Promise<{
        stateInit: Cell;
        address: Address;
        code: Uint8Array | Cell;
        data: Cell;
    }>;
    /**
     * @param code  {Cell}
     * @param data  {Cell}
     * @param library {null}
     * @param splitDepth {null}
     * @param ticktock  {null}
     * @return {Cell}
     */
    static createStateInit(code: Uint8Array | Cell, data: Cell, library?: null, splitDepth?: null, ticktock?: null): Cell;
    /**
     * @param dest  {Address | string}
     * @param gramValue  {number | BN}
     * @param ihrDisabled  {boolean}
     * @param bounce  {null | boolean}
     * @param bounced {boolean}
     * @param src  {Address | string}
     * @param currencyCollection  {null}
     * @param ihrFees  {number | BN}
     * @param fwdFees  {number | BN}
     * @param createdLt  {number | BN}
     * @param createdAt  {number | BN}
     * @return {Cell}
     */
    static createInternalMessageHeader(dest: Address | string, gramValue?: number | BN, ihrDisabled?: boolean, bounce?: null | boolean, bounced?: boolean, src?: Address | string | null, currencyCollection?: null, ihrFees?: number | BN, fwdFees?: number | BN, createdLt?: number | BN, createdAt?: number | BN): Cell;
    /**
     * @param dest  {Address | string}
     * @param src  {Address | string}
     * @param importFee  {number | BN}
     * @return {Cell}
     */
    static createExternalMessageHeader(dest: Address | string, src?: Address | string | null, importFee?: number): Cell;
    /**
     * Create CommonMsgInfo contains header, stateInit, body
     * @param header {Cell}
     * @param stateInit?  {Cell}
     * @param body?  {Cell}
     * @return {Cell}
     */
    static createCommonMsgInfo(header: Cell, stateInit?: Cell | null, body?: Cell | null): Cell;
    static createMethod(provider: HttpProvider, queryPromise: Promise<any>): {
        getQuery: () => Promise<any>;
        send: () => Promise<any>;
        estimateFee: () => Promise<any>;
    };
}
