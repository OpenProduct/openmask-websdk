import BN from "bn.js";
import { Cell } from "../../boc/cell";
import HttpProvider from "../../providers/httpProvider";
import Address from "../../utils/address";
import { Contract, Options } from "../contract";
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
    createInitExternalMessage(secretKey: Uint8Array): Promise<{
        address: Address;
        message: Cell;
        body: Cell;
        signingMessage: Cell;
        stateInit: Cell;
        code: Uint8Array | Cell;
        data: Cell;
    }>;
    /**
     * @protected
     * @param signingMessage {Cell}
     * @param secretKey {Uint8Array}  nacl.KeyPair.secretKey
     * @param seqno {number}
     * @param dummySignature?    {boolean}
     * @return {Promise<{address: Address, signature: Uint8Array, message: Cell, cell: Cell, body: Cell, resultMessage: Cell}>}
     */
    createExternalMessage(signingMessage: Cell, secretKey: Uint8Array, seqno: number, dummySignature?: boolean): Promise<{
        address: Address;
        message: Cell;
        body: Cell;
        signature: Uint8Array;
        signingMessage: Cell;
        stateInit: Cell | null;
        code: Uint8Array | Cell | null;
        data: Cell | null;
    }>;
    /**
     * @param secretKey {Uint8Array}  nacl.KeyPair.secretKey
     * @param address   {Address | string}
     * @param amount    {BN | number} in nanograms
     * @param seqno {number}
     * @param payload?   {string | Uint8Array | Cell}
     * @param sendMode?  {number}
     * @param dummySignature?    {boolean}
     * @param stateInit? {Cell}
     * @return {Promise<{address: Address, signature: Uint8Array, message: Cell, cell: Cell, body: Cell, resultMessage: Cell}>}
     */
    createTransferMessage(secretKey: Uint8Array, address: Address | string, amount: BN | number, seqno: number, payload?: string | Uint8Array | Cell, sendMode?: number, dummySignature?: boolean, stateInit?: Cell | null): Promise<{
        address: Address;
        message: Cell;
        body: Cell;
        signature: Uint8Array;
        signingMessage: Cell;
        stateInit: Cell | null;
        code: Uint8Array | Cell | null;
        data: Cell | null;
    }>;
}
