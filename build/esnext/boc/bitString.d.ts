/// <reference types="node" />
import BN from "bn.js";
import Address from "../utils/address";
export declare class BitString {
    array: Uint8Array;
    cursor: number;
    length: number;
    /**
     * @param length {number}    length of BitString in bits
     */
    constructor(length: number);
    static alloc(length: number): BitString;
    /**
     * @return {number}
     */
    getFreeBits(): number;
    /**
     * @return {number}
     */
    getUsedBits(): number;
    /**
     * @return {number}
     */
    getUsedBytes(): number;
    /**
     * @param n {number}
     * @return {boolean}    bit value at position `n`
     */
    get(n: number): boolean;
    /**
     * @private
     * @param n {number}
     */
    checkRange(n: number): void;
    /**
     * Set bit value to 1 at position `n`
     * @param n {number}
     */
    on(n: number): void;
    /**
     * Set bit value to 0 at position `n`
     * @param n {number}
     */
    off(n: number): void;
    /**
     * Toggle bit value at position `n`
     * @param n {number}
     */
    toggle(n: number): void;
    /**
     * forEach every bit
     * @param callback  {function(boolean): void}
     */
    forEach(callback: (value: boolean) => void): void;
    /**
     * Write bit and increase cursor
     * @param b  {boolean | number}
     */
    writeBit(b: boolean | number): void;
    /**
     * @param ba  {Array<boolean | number>}
     */
    writeBitArray(ba: Array<boolean | number>): void;
    /**
     * Write unsigned int
     * @param number  {number | BN}
     * @param bitLength  {number}  size of uint in bits
     */
    writeUint(number: number | BN, bitLength: number): void;
    /**
     * Write signed int
     * @param number  {number | BN}
     * @param bitLength  {number}  size of int in bits
     */
    writeInt(number: number | BN, bitLength: number): void;
    /**
     * Write unsigned 8-bit int
     * @param ui8 {number}
     */
    writeUint8(ui8: number): void;
    /**
     * Write array of unsigned 8-bit ints
     * @param ui8 {Uint8Array}
     */
    writeBytes(ui8: Uint8Array): void;
    /**
     * Write UTF-8 string
     *
     * @param value {string}
     */
    writeString(value: string): void;
    /**
     * @param amount  {number | BN} in nanograms
     */
    writeGrams(amount: number | BN): void;
    /**
     * @param amount  {number | BN} in nanotons
     */
    writeCoins(amount: number | BN): void;
    /**
     * @param address {Address | null}
     */
    writeAddress(address: Address | null): void;
    /**
     * write another BitString to this BitString
     * @param anotherBitString  {BitString}
     */
    writeBitString(anotherBitString: BitString): void;
    writeVarUInt(value: BN | number, headerBits: number): void;
    writeBuffer: (buffer: Buffer) => void;
    clone(): BitString;
    /**
     * @return {string} hex
     */
    toString(): string;
    /**
     * @return {Uint8Array}
     */
    getTopUppedArray(): Uint8Array;
    /**
     * like Fift
     * @return {string}
     */
    toHex(): string;
    /**
     * set this cell data to match provided topUppedArray
     * @param array  {Uint8Array}
     * @param fullfilledBytes  {boolean}
     */
    setTopUppedArray(array: Uint8Array, fullfilledBytes?: boolean): void;
}
