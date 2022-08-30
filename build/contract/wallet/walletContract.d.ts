import BN from "bn.js";
import { Cell } from "../../boc/cell";
import HttpProvider from "../../providers/httpProvider";
import Address from "../../utils/address";
import { Contract, ExternalMessage, Method, Options } from "../contract";
export interface TransferParams {
    secretKey: Uint8Array;
    toAddress: Address | string;
    amount: BN | number;
    seqno: number;
    payload: string | Uint8Array | Cell;
    sendMode: number;
    stateInit?: Cell;
}
export interface BaseMethods {
    seqno: () => {
        call: () => Promise<number>;
    };
    transfer: (params: TransferParams) => Method;
}
/**
 * Abstract standard wallet class
 */
export declare class WalletContract extends Contract {
    deploy: (secretKey: Uint8Array) => void;
    /**
     * @param provider    {HttpProvider}
     * @param options?    {{code: Uint8Array, publicKey?: Uint8Array, address?: Address | string, wc?: number}}
     */
    constructor(provider: HttpProvider, options: Options);
    getName(): void;
    /**
     * @override
     * @protected
     * @return {Cell} cell contains wallet data
     */
    createDataCell(): Cell;
    /**
     * @protected
     * @param   seqno?   {number}
     * @return {Cell}
     */
    createSigningMessage(seqno?: number): Cell;
    /**
     * External message for initialization
     * @param secretKey  {Uint8Array} nacl.KeyPair.secretKey
     * @return {{address: Address, message: Cell, body: Cell, sateInit: Cell, code: Cell, data: Cell}}
     */
    createInitExternalMessage(secretKey: Uint8Array): Promise<ExternalMessage>;
    /**
     * @protected
     * @param signingMessage {Cell}
     * @param secretKey {Uint8Array}  nacl.KeyPair.secretKey
     * @param seqno {number}
     * @param dummySignature?    {boolean}
     * @return {Promise<ExternalMessage>}
     */
    createExternalMessage(signingMessage: Cell, secretKey: Uint8Array, seqno: number, dummySignature?: boolean): Promise<ExternalMessage>;
    /**
     * @param secretKey {Uint8Array}  nacl.KeyPair.secretKey
     * @param address   {Address | string}
     * @param amount    {BN | number} in nanograms
     * @param seqno {number}
     * @param payload?   {string | Uint8Array | Cell}
     * @param sendMode?  {number}
     * @param dummySignature?    {boolean}
     * @param stateInit? {Cell}
     * @return {Promise<ExternalMessage>}
     */
    createTransferMessage(secretKey: Uint8Array, address: Address | string, amount: BN | number, seqno: number, payload?: string | Uint8Array | Cell, sendMode?: number, dummySignature?: boolean, stateInit?: Cell | null): Promise<ExternalMessage>;
}
