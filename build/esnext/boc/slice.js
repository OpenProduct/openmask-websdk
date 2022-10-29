import BN from "bn.js";
import Address from "../utils/address";
import { bytesToHex } from "../utils/utils";
import { BitString } from "./bitString";
import { Cell } from "./cell";
/**
 * A partial view of a TVM cell, used for parsing data from Cells.
 */
export class Slice {
    array;
    length;
    readCursor;
    refs;
    refCursor;
    /**
     * @param array {Uint8Array}
     * @param length {number} length in bits
     * @param refs {Slice[]} child cells
     */
    constructor(array, length, refs) {
        this.array = array;
        this.length = length;
        this.readCursor = 0;
        this.refs = refs;
        this.refCursor = 0;
    }
    /**
     * @return {number}
     */
    getFreeBits() {
        return this.length - this.readCursor;
    }
    getFreeRefs() {
        return this.refs.length - this.refCursor;
    }
    /**
     * @private
     * @param n {number}
     */
    checkRange(n) {
        if (n > this.length) {
            throw Error("BitString overflow");
        }
    }
    /**
     * @private
     * @param n {number}
     * @return {boolean}    bit value at position `n`
     */
    get(n) {
        this.checkRange(n);
        return (this.array[(n / 8) | 0] & (1 << (7 - (n % 8)))) > 0;
    }
    /**
     * @return {boolean}   read bit
     */
    loadBit() {
        const result = this.get(this.readCursor);
        this.readCursor++;
        return result;
    }
    /**
     * @param bitLength {number}
     * @return {Uint8Array}
     */
    loadBits(bitLength) {
        const result = new BitString(bitLength);
        for (let i = 0; i < bitLength; i++) {
            result.writeBit(this.loadBit());
        }
        return result.array;
    }
    /**
     * Reads unsigned int
     *
     * @param {number} bitLength Size of uint in bits
     * @returns {BN} number
     */
    loadUint(bitLength) {
        if (bitLength < 1) {
            throw "Incorrect bitLength";
        }
        let s = "";
        for (let i = 0; i < bitLength; i++) {
            s += this.loadBit() ? "1" : "0";
        }
        return new BN(s, 2);
    }
    /**
     * Reads signed int
     *
     * @param {number} bitLength Size of uint in bits
     * @returns {BN} number
     */
    loadInt(bitLength) {
        if (bitLength < 1) {
            throw "Incorrect bitLength";
        }
        const sign = this.loadBit();
        if (bitLength === 1) {
            return sign ? new BN(-1) : new BN(0);
        }
        let number = this.loadUint(bitLength - 1);
        if (sign) {
            const b = new BN(2);
            const nb = b.pow(new BN(bitLength - 1));
            number = number.sub(nb);
        }
        return number;
    }
    /**
     * @param bitLength {number}
     * @return {BN}
     */
    loadVarUint(bitLength) {
        const len = this.loadUint(new BN(bitLength).toString(2).length - 1);
        if (len.toNumber() === 0) {
            return new BN(0);
        }
        else {
            return this.loadUint(len.toNumber() * 8);
        }
    }
    /**
     * @return {BN}
     */
    loadCoins() {
        return this.loadVarUint(16);
    }
    loadAddress() {
        const b = this.loadUint(2);
        if (b.toNumber() === 0)
            return null; // null address
        if (b.toNumber() !== 2)
            throw new Error("unsupported address type");
        if (this.loadBit())
            throw new Error("unsupported address type");
        const wc = this.loadInt(8).toNumber();
        const hashPart = this.loadBits(256);
        return new Address(wc + ":" + bytesToHex(hashPart));
    }
    /**
     * @return {Slice}
     */
    loadRef() {
        if (this.refCursor >= 4)
            throw new Error("refs overflow");
        const result = this.refs[this.refCursor];
        this.refCursor++;
        return result;
    }
    toCell() {
        const free = this.getFreeBits();
        const bits = this.loadBits(free);
        const freeRefs = this.getFreeRefs();
        const cell = new Cell();
        cell.bits.writeBytes(bits);
        for (let i = 0; i < freeRefs; i++) {
            const ref = this.loadRef();
            cell.refs.push(ref);
        }
        return cell;
    }
}
