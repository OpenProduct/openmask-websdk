"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slice = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const address_1 = __importDefault(require("../utils/address"));
const utils_1 = require("../utils/utils");
const bitString_1 = require("./bitString");
const cell_1 = require("./cell");
const parseDict_1 = require("./dict/parseDict");
/**
 * A partial view of a TVM cell, used for parsing data from Cells.
 */
class Slice {
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
    readUnaryLength() {
        let res = 0;
        while (this.loadBit()) {
            res++;
        }
        return res;
    }
    readRemaining() {
        let res = bitString_1.BitString.alloc(1023);
        while (this.readCursor < this.length) {
            res.writeBit(this.loadBit());
        }
        return res;
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
        const result = new bitString_1.BitString(bitLength);
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
        return new bn_js_1.default(s, 2);
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
            return sign ? new bn_js_1.default(-1) : new bn_js_1.default(0);
        }
        let number = this.loadUint(bitLength - 1);
        if (sign) {
            const b = new bn_js_1.default(2);
            const nb = b.pow(new bn_js_1.default(bitLength - 1));
            number = number.sub(nb);
        }
        return number;
    }
    /**
     * @param bitLength {number}
     * @return {BN}
     */
    loadVarUint(bitLength) {
        const len = this.loadUint(new bn_js_1.default(bitLength).toString(2).length - 1);
        if (len.toNumber() === 0) {
            return new bn_js_1.default(0);
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
        return new address_1.default(wc + ":" + (0, utils_1.bytesToHex)(hashPart));
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
    readCell = () => {
        let first = this.loadRef();
        if (first) {
            return first.toCell();
        }
        else {
            throw Error("No ref");
        }
    };
    readOptDict = (keySize, extractor) => {
        if (this.loadBit()) {
            return this.readDict(keySize, extractor);
        }
        else {
            return null;
        }
    };
    readDict = (keySize, extractor) => {
        let first = this.loadRef();
        if (first) {
            return (0, parseDict_1.parseDict)(first, keySize, extractor);
        }
        else {
            throw Error("No ref");
        }
    };
    toCell() {
        const free = this.getFreeBits();
        const bits = this.loadBits(free);
        const freeRefs = this.getFreeRefs();
        const cell = new cell_1.Cell();
        cell.bits.writeBytes(bits);
        for (let i = 0; i < freeRefs; i++) {
            const ref = this.loadRef();
            cell.refs.push(ref.toCell());
        }
        return cell;
    }
}
exports.Slice = Slice;
