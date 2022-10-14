/// <reference types="node" />
import BN from "bn.js";
import { Pair } from "./httpProviderUtils";
export interface EstimateFeeValues {
    in_fwd_fee: number;
    storage_fee: number;
    gas_fee: number;
    fwd_fee: number;
}
export interface EstimateFee {
    source_fees: EstimateFeeValues;
}
interface JRPSRequest {
    id: number;
    jsonrpc: string;
    method: string;
    params: any;
}
export declare class TonHttpProvider {
    SHARD_ID_ALL: string;
    host: string;
    options: {
        apiKey?: string;
    };
    /**
     * @param host? {string}
     * @param options? {{apiKey: string}}
     */
    constructor(host: string, options?: {
        apiKey?: string;
    });
    /**
     * @private
     * @param apiUrl   {string}
     * @param request   {any}
     * @return {Promise<any>}
     */
    sendImpl(apiUrl: string, request: JRPSRequest): Promise<any>;
    /**
     * @param method    {string}
     * @param params    {any}  todo: Array<any>
     * @return {Promise<any>}
     */
    send<Payload>(method: string, params: Payload): Promise<any>;
    /**
     * Use this method to get information about address: balance, code, data, last_transaction_id.
     * @param address {string}
     */
    getAddressInfo(address: string): Promise<any>;
    /**
     * Check if contract is deployed
     * @param address addres to check
     * @returns true if contract is in active state
     */
    isContractDeployed: (address: string) => Promise<boolean>;
    /**
     * Resolves contract state
     * @param address contract address
     */
    getContractState: (address: string) => Promise<{
        balance: BN;
        state: "frozen" | "active" | "uninitialized";
        code: Buffer | null;
        data: Buffer | null;
        lastTransaction: {
            lt: any;
            hash: any;
        } | null;
        blockId: {
            workchain: any;
            shard: any;
            seqno: any;
        };
        timestampt: any;
    }>;
    /**
     * Similar to previous one but tries to parse additional information for known contract types. This method is based on generic.getAccountState thus number of recognizable contracts may grow. For wallets we recommend to use getWalletInformation.
     * @param address {string}
     */
    getExtendedAddressInfo(address: string): Promise<any>;
    /**
     * Use this method to retrieve wallet information, this method parse contract state and currently supports more wallet types than getExtendedAddressInformation: simple wallet, stadart wallet and v3 wallet.
     * @param address {string}
     */
    getWalletInfo(address: string): Promise<any>;
    /**
     * Use this method to get transaction history of a given address.
     * @param address   {string}
     * @param limit?    {number}
     * @param lt?    {number}
     * @param hash?    {string}
     * @param to_lt?    {number}
     * @return array of transaction object
     */
    getTransactions(address: string, limit?: number | undefined, lt?: number | undefined, hash?: string | undefined, to_lt?: number | undefined, archival?: undefined): Promise<any>;
    /**
     * Use this method to get balance (in nanograms) of a given address.
     * @param address {string}
     */
    getBalance(address: string): Promise<any>;
    /**
     * Use this method to get seqno of a given address.
     * @param address {string}
     */
    getSeqno(address: string): Promise<number>;
    /**
     * Use this method to send serialized boc file: fully packed and serialized external message.
     * @param base64 {string} base64 of boc bytes Cell.toBoc
     */
    sendBoc(base64: string): Promise<any>;
    /**
     * @param query     object as described https://toncenter.com/api/test/v2/#estimateFee
     * @return fees object
     */
    getEstimateFee<Payload>(query: Payload): Promise<EstimateFee>;
    /**
     * Invoke get-method of smart contract
     * todo: think about throw error if result.exit_code !== 0 (the change breaks backward compatibility)
     * @param address   {string}    contract address
     * @param method   {string | number}        method name or method id
     * @param params?   Array of stack elements: [['num',3], ['cell', cell_object], ['slice', slice_object]]
     */
    call(address: string, method: string, params?: Pair[]): Promise<any>;
    /**
     * Invoke get-method of smart contract
     * @param address   {string}    contract address
     * @param method   {string | number}        method name or method id
     * @param params?   Array of stack elements: [['num',3], ['cell', cell_object], ['slice', slice_object]]
     */
    call2(address: string, method: string, params?: Pair[]): Promise<any>;
    /**
     * Returns ID's of last and init block of masterchain
     */
    getMasterchainInfo(): Promise<any>;
    /**
     * Returns ID's of shardchain blocks included in this masterchain block
     * @param masterchainBlockNumber {number}
     */
    getBlockShards(masterchainBlockNumber: number): Promise<any>;
    /**
     * Returns transactions hashes included in this block
     * @param workchain {number}
     * @param shardId   {string}
     * @param shardBlockNumber  {number}
     */
    getBlockTransactions(workchain: number, shardId: string, shardBlockNumber: number): Promise<any>;
    /**
     * Returns transactions hashes included in this masterhcain block
     * @param masterchainBlockNumber  {number}
     */
    getMasterchainBlockTransactions(masterchainBlockNumber: number): Promise<any>;
    /**
     * Returns block header and his previous blocks ID's
     * @param workchain {number}
     * @param shardId   {string}
     * @param shardBlockNumber  {number}
     */
    getBlockHeader(workchain: number, shardId: string, shardBlockNumber: number): Promise<any>;
    /**
     * Returns masterchain block header and his previous block ID
     * @param masterchainBlockNumber  {number}
     */
    getMasterchainBlockHeader(masterchainBlockNumber: number): Promise<any>;
}
export default TonHttpProvider;
