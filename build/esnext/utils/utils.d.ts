import BN from "bn.js";
import nacl from "tweetnacl";
export declare function sha256_sync(bytes: Uint8Array): ArrayBuffer;
export declare function sha256_hex(key: string): string;
/**
 * from coins to nanocoins
 * @param amount {BN | string}
 * @return {BN}
 */
export declare function toNano(amount: BN | string): BN;
/**
 * from nanocoins to coins
 * @param amount  {BN | string}
 * @return {string}
 */
export declare function fromNano(amount: BN | string): string;
/**
 * @param buffer  {Uint8Array}
 * @return {string}
 */
export declare function bytesToHex(buffer: Uint8Array): string;
/**
 * @param s {string}
 * @return {Uint8Array}
 */
export declare function hexToBytes(s: string): Uint8Array;
/**
 * @param str {string}
 * @param size  {number}
 * @return {Uint8Array}
 */
export declare function stringToBytes(str: string, size?: number): Uint8Array;
/**
 * @param bytes {Uint8Array}
 * @return {Uint8Array}
 */
export declare function crc32c(bytes: Uint8Array): Uint8Array;
/**
 * @param data  {ArrayLike<number>}
 * @return {Uint8Array}
 */
export declare function crc16(data: ArrayLike<number>): Uint8Array;
/**
 * @param a {Uint8Array}
 * @param b {Uint8Array}
 * @return {Uint8Array}
 */
export declare function concatBytes(a: Uint8Array, b: Uint8Array): Uint8Array;
/**
 * @param a {Uint8Array}
 * @param b {Uint8Array}
 * @return {boolean}
 */
export declare function compareBytes(a: Uint8Array, b: Uint8Array): boolean;
/**
 * @param bytes {Uint8Array}
 * @return {string}
 */
export declare function bytesToBase64(bytes: Uint8Array): string;
export declare function base64toString(base64: string): string;
export declare function stringToBase64(s: string): string;
/**
 * @param base64  {string}
 * @return {Uint8Array}
 */
export declare function base64ToBytes(base64: string): Uint8Array;
/**
 * @param n  {number}
 * @param ui8array  {Uint8Array}
 * @return {number}
 */
export declare function readNBytesUIntFromArray(n: number, ui8array: Uint8Array): number;
/**
 * @param seed  {Uint8Array}
 * @returns {nacl.SignKeyPair}
 */
export declare function keyPairFromSeed(seed: Uint8Array): nacl.SignKeyPair;
/**
 * @returns {nacl.SignKeyPair}
 */
export declare function newKeyPair(): nacl.SignKeyPair;
/**
 * @returns {Uint8Array}
 */
export declare function newSeed(): Uint8Array;
