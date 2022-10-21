/// <reference types="node" />
import BN from "bn.js";
import { Buffer } from "buffer";
import { Cell } from "../../../boc/cell";
import TonHttpProvider from "../../../providers/httpProvider";
import Address from "../../../utils/address";
export declare const SNAKE_DATA_PREFIX = 0;
export declare const CHUNK_DATA_PREFIX = 1;
export declare const ONCHAIN_CONTENT_PREFIX = 0;
export declare const OFFCHAIN_CONTENT_PREFIX = 1;
/**
 * @param uri   {string}
 * @returns {Uint8Array}
 */
export declare const serializeUri: (uri: string) => Uint8Array;
/**
 * @param bytes {Uint8Array}
 * @return {string}
 */
export declare const parseUri: (bytes: Uint8Array) => string;
/**
 * @param uri {string}
 * @return {Cell}
 */
export declare const createOffchainUriCell: (uri: string) => Cell;
/**
 * @param cell {Cell}
 * @returns {string}
 */
export declare const parseOffchainUriCell: (cell: Cell) => string;
export declare function makeSnakeCell(data: Buffer): Cell;
export declare const createOffChainContent: (content: string) => Cell;
/**
 * @param cell  {Cell}
 * @return {Address|null}
 */
export declare const parseAddress: (cell: Cell) => Address | null;
/**
 * @param provider {TonHttpProvider}
 * @param address {string}
 * @return {Promise<{royalty: number, royaltyFactor: number, royaltyBase: number, royaltyAddress: Address}>}
 */
export declare const getRoyaltyParams: (provider: TonHttpProvider, address: string) => Promise<{
    royalty: number;
    royaltyBase: any;
    royaltyFactor: any;
    royaltyAddress: Address | null;
}>;
export declare const nftTransferBody: (params: {
    queryId?: number;
    newOwnerAddress: Address;
    forwardAmount?: BN;
    forwardPayload?: Uint8Array;
    responseAddress: Address;
}) => Cell;
export declare const nftGetStaticDataBody: (params: {
    queryId?: number;
}) => Cell;
