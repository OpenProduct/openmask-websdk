import { Cell } from "../../../boc/cell";
import Address from "../../../utils/address";
export const SNAKE_DATA_PREFIX = 0x00;
export const CHUNK_DATA_PREFIX = 0x01;
export const ONCHAIN_CONTENT_PREFIX = 0x00;
export const OFFCHAIN_CONTENT_PREFIX = 0x01;
/**
 * @param uri   {string}
 * @returns {Uint8Array}
 */
export const serializeUri = (uri) => {
    return new TextEncoder().encode(encodeURI(uri));
};
/**
 * @param bytes {Uint8Array}
 * @return {string}
 */
export const parseUri = (bytes) => {
    return new TextDecoder().decode(bytes);
};
/**
 * @param uri {string}
 * @return {Cell}
 */
export const createOffchainUriCell = (uri) => {
    const cell = new Cell();
    cell.bits.writeUint(OFFCHAIN_CONTENT_PREFIX, 8);
    cell.bits.writeBytes(serializeUri(uri));
    return cell;
};
/**
 * @param cell {Cell}
 * @returns {string}
 */
export const parseOffchainUriCell = (cell) => {
    if (cell.bits.array[0] !== OFFCHAIN_CONTENT_PREFIX) {
        throw new Error("no OFFCHAIN_CONTENT_PREFIX");
    }
    let length = 0;
    let c = cell;
    while (c) {
        length += c.bits.array.length;
        c = c.refs[0];
    }
    const bytes = new Uint8Array(length);
    length = 0;
    c = cell;
    while (c) {
        bytes.set(c.bits.array, length);
        length += c.bits.array.length;
        c = c.refs[0];
    }
    return parseUri(bytes.slice(1)); // slice OFFCHAIN_CONTENT_PREFIX
};
/**
 * @param bs    {BitString}
 * @param cursor    {number}
 * @param bits  {number}
 * @return {BigInt}
 */
const readIntFromBitString = (bs, cursor, bits) => {
    let n = BigInt(0);
    for (let i = 0; i < bits; i++) {
        n *= BigInt(2);
        n += BigInt(bs.get(cursor + i));
    }
    return n;
};
/**
 * @param cell  {Cell}
 * @return {Address|null}
 */
export const parseAddress = (cell) => {
    let n = readIntFromBitString(cell.bits, 3, 8);
    if (n > BigInt(127)) {
        n = n - BigInt(256);
    }
    const hashPart = readIntFromBitString(cell.bits, 3 + 8, 256);
    if (n.toString(10) + ":" + hashPart.toString(16) === "0:0")
        return null;
    const s = n.toString(10) + ":" + hashPart.toString(16).padStart(64, "0");
    return new Address(s);
};
/**
 * @param provider {HttpProvider}
 * @param address {string}
 * @return {Promise<{royalty: number, royaltyFactor: number, royaltyBase: number, royaltyAddress: Address}>}
 */
export const getRoyaltyParams = async (provider, address) => {
    const result = await provider.call2(address, "royalty_params");
    const royaltyFactor = result[0].toNumber();
    const royaltyBase = result[1].toNumber();
    const royalty = royaltyFactor / royaltyBase;
    const royaltyAddress = parseAddress(result[2]);
    return { royalty, royaltyBase, royaltyFactor, royaltyAddress };
};