"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newSeed = exports.newKeyPair = exports.keyPairFromSeed = exports.readNBytesUIntFromArray = exports.base64ToBytes = exports.stringToBase64 = exports.base64toString = exports.bytesToBase64 = exports.compareBytes = exports.concatBytes = exports.crc16 = exports.crc32c = exports.stringToBytes = exports.hexToBytes = exports.bytesToHex = exports.fromNano = exports.toNano = exports.sha256 = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const ethunit = require("ethjs-unit");
/**
 *
 * @param bytes {Uint8Array}
 * @return  {Promise<ArrayBuffer>}
 */
function sha256(bytes) {
    return crypto.subtle.digest("SHA-256", bytes);
}
exports.sha256 = sha256;
/**
 * from coins to nanocoins
 * @param amount {BN | string}
 * @return {BN}
 */
function toNano(amount) {
    if (!bn_js_1.default.isBN(amount) && !(typeof amount === "string")) {
        throw new Error("Please pass numbers as strings or BN objects to avoid precision errors.");
    }
    return ethunit.toWei(amount, "gwei");
}
exports.toNano = toNano;
/**
 * from nanocoins to coins
 * @param amount  {BN | string}
 * @return {string}
 */
function fromNano(amount) {
    if (!bn_js_1.default.isBN(amount) && !(typeof amount === "string")) {
        throw new Error("Please pass numbers as strings or BN objects to avoid precision errors.");
    }
    return ethunit.fromWei(amount, "gwei");
}
exports.fromNano = fromNano;
// look up tables
const to_hex_array = [];
const to_byte_map = {};
for (let ord = 0; ord <= 0xff; ord++) {
    let s = ord.toString(16);
    if (s.length < 2) {
        s = "0" + s;
    }
    to_hex_array.push(s);
    to_byte_map[s] = ord;
}
//  converter using lookups
/**
 * @param buffer  {Uint8Array}
 * @return {string}
 */
function bytesToHex(buffer) {
    const hex_array = [];
    //(new Uint8Array(buffer)).forEach((v) => { hex_array.push(to_hex_array[v]) });
    for (let i = 0; i < buffer.byteLength; i++) {
        hex_array.push(to_hex_array[buffer[i]]);
    }
    return hex_array.join("");
}
exports.bytesToHex = bytesToHex;
// reverse conversion using lookups
/**
 * @param s {string}
 * @return {Uint8Array}
 */
function hexToBytes(s) {
    s = s.toLowerCase();
    const length2 = s.length;
    if (length2 % 2 !== 0) {
        throw "hex string must have length a multiple of 2";
    }
    const length = length2 / 2;
    const result = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        const i2 = i * 2;
        const b = s.substring(i2, i2 + 2);
        if (!to_byte_map.hasOwnProperty(b))
            throw new Error("invalid hex character " + b);
        result[i] = to_byte_map[b];
    }
    return result;
}
exports.hexToBytes = hexToBytes;
/**
 * @param str {string}
 * @param size  {number}
 * @return {Uint8Array}
 */
function stringToBytes(str, size = 1) {
    let buf;
    let bufView;
    if (size === 1) {
        buf = new ArrayBuffer(str.length);
        bufView = new Uint8Array(buf);
    }
    else if (size === 2) {
        buf = new ArrayBuffer(str.length * 2);
        bufView = new Uint16Array(buf);
    }
    else if (size === 4) {
        buf = new ArrayBuffer(str.length * 4);
        bufView = new Uint32Array(buf);
    }
    else {
        throw new Error("Unexpected size");
    }
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return new Uint8Array(bufView.buffer);
}
exports.stringToBytes = stringToBytes;
/**
 * @private
 * @param crc {number}
 * @param bytes {Uint8Array}
 * @return {number}
 */
function _crc32c(crc, bytes) {
    const POLY = 0x82f63b78;
    crc ^= 0xffffffff;
    for (let n = 0; n < bytes.length; n++) {
        crc ^= bytes[n];
        crc = crc & 1 ? (crc >>> 1) ^ POLY : crc >>> 1;
        crc = crc & 1 ? (crc >>> 1) ^ POLY : crc >>> 1;
        crc = crc & 1 ? (crc >>> 1) ^ POLY : crc >>> 1;
        crc = crc & 1 ? (crc >>> 1) ^ POLY : crc >>> 1;
        crc = crc & 1 ? (crc >>> 1) ^ POLY : crc >>> 1;
        crc = crc & 1 ? (crc >>> 1) ^ POLY : crc >>> 1;
        crc = crc & 1 ? (crc >>> 1) ^ POLY : crc >>> 1;
        crc = crc & 1 ? (crc >>> 1) ^ POLY : crc >>> 1;
    }
    return crc ^ 0xffffffff;
}
/**
 * @param bytes {Uint8Array}
 * @return {Uint8Array}
 */
function crc32c(bytes) {
    //Version suitable for crc32-c of BOC
    const int_crc = _crc32c(0, bytes);
    const arr = new ArrayBuffer(4);
    const view = new DataView(arr);
    view.setUint32(0, int_crc, false);
    return new Uint8Array(arr).reverse();
}
exports.crc32c = crc32c;
/**
 * @param data  {ArrayLike<number>}
 * @return {Uint8Array}
 */
function crc16(data) {
    const poly = 0x1021;
    let reg = 0;
    const message = new Uint8Array(data.length + 2);
    message.set(data);
    for (let byte of message) {
        let mask = 0x80;
        while (mask > 0) {
            reg <<= 1;
            if (byte & mask) {
                reg += 1;
            }
            mask >>= 1;
            if (reg > 0xffff) {
                reg &= 0xffff;
                reg ^= poly;
            }
        }
    }
    return new Uint8Array([Math.floor(reg / 256), reg % 256]);
}
exports.crc16 = crc16;
/**
 * @param a {Uint8Array}
 * @param b {Uint8Array}
 * @return {Uint8Array}
 */
function concatBytes(a, b) {
    const c = new Uint8Array(a.length + b.length);
    c.set(a);
    c.set(b, a.length);
    return c;
}
exports.concatBytes = concatBytes;
/**
 * @param a {Uint8Array}
 * @param b {Uint8Array}
 * @return {boolean}
 */
function compareBytes(a, b) {
    // TODO Make it smarter
    return a.toString() === b.toString();
}
exports.compareBytes = compareBytes;
const base64abc = (() => {
    const abc = [];
    const A = "A".charCodeAt(0);
    const a = "a".charCodeAt(0);
    const n = "0".charCodeAt(0);
    for (let i = 0; i < 26; ++i) {
        abc.push(String.fromCharCode(A + i));
    }
    for (let i = 0; i < 26; ++i) {
        abc.push(String.fromCharCode(a + i));
    }
    for (let i = 0; i < 10; ++i) {
        abc.push(String.fromCharCode(n + i));
    }
    abc.push("+");
    abc.push("/");
    return abc;
})();
/**
 * @param bytes {Uint8Array}
 * @return {string}
 */
function bytesToBase64(bytes) {
    let result = "";
    let i;
    const l = bytes.length;
    for (i = 2; i < l; i += 3) {
        result += base64abc[bytes[i - 2] >> 2];
        result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
        result += base64abc[((bytes[i - 1] & 0x0f) << 2) | (bytes[i] >> 6)];
        result += base64abc[bytes[i] & 0x3f];
    }
    if (i === l + 1) {
        // 1 octet missing
        result += base64abc[bytes[i - 2] >> 2];
        result += base64abc[(bytes[i - 2] & 0x03) << 4];
        result += "==";
    }
    if (i === l) {
        // 2 octets missing
        result += base64abc[bytes[i - 2] >> 2];
        result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
        result += base64abc[(bytes[i - 1] & 0x0f) << 2];
        result += "=";
    }
    return result;
}
exports.bytesToBase64 = bytesToBase64;
// todo: base64 decoding process could ignore one extra character at the end of string and the byte-length check below won't be able to catch it.
function base64toString(base64) {
    // TODO: CHECK
    if (typeof self === "undefined") {
        return Buffer.from(base64, "base64").toString("binary"); // todo: (tolya-yanot) Buffer silently ignore incorrect base64 symbols, we need to throw error
    }
    else {
        return atob(base64);
    }
}
exports.base64toString = base64toString;
function stringToBase64(s) {
    // TODO: CHECK
    if (typeof self === "undefined") {
        return Buffer.from(s, "binary").toString("base64"); // todo: (tolya-yanot) Buffer silently ignore incorrect base64 symbols, we need to throw error
    }
    else {
        return btoa(s);
    }
}
exports.stringToBase64 = stringToBase64;
/**
 * @param base64  {string}
 * @return {Uint8Array}
 */
function base64ToBytes(base64) {
    const binary_string = base64toString(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
}
exports.base64ToBytes = base64ToBytes;
/**
 * @param n  {number}
 * @param ui8array  {Uint8Array}
 * @return {number}
 */
function readNBytesUIntFromArray(n, ui8array) {
    let res = 0;
    for (let c = 0; c < n; c++) {
        res *= 256;
        res += ui8array[c];
    }
    return res;
}
exports.readNBytesUIntFromArray = readNBytesUIntFromArray;
/**
 * @param seed  {Uint8Array}
 * @returns {nacl.SignKeyPair}
 */
function keyPairFromSeed(seed) {
    return tweetnacl_1.default.sign.keyPair.fromSeed(seed);
}
exports.keyPairFromSeed = keyPairFromSeed;
/**
 * @returns {nacl.SignKeyPair}
 */
function newKeyPair() {
    return tweetnacl_1.default.sign.keyPair();
}
exports.newKeyPair = newKeyPair;
/**
 * @returns {Uint8Array}
 */
function newSeed() {
    return tweetnacl_1.default.sign.keyPair().secretKey.slice(0, 32);
}
exports.newSeed = newSeed;
