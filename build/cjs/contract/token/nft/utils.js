"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nftGetStaticDataBody = exports.nftTransferBody = exports.getRoyaltyParams = exports.parseAddress = exports.createOffChainContent = exports.makeSnakeCell = exports.parseOffchainUriCell = exports.createOffchainUriCell = exports.parseUri = exports.serializeUri = exports.OFFCHAIN_CONTENT_PREFIX = exports.ONCHAIN_CONTENT_PREFIX = exports.CHUNK_DATA_PREFIX = exports.SNAKE_DATA_PREFIX = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const buffer_1 = require("buffer");
const cell_1 = require("../../../boc/cell");
const address_1 = __importDefault(require("../../../utils/address"));
exports.SNAKE_DATA_PREFIX = 0x00;
exports.CHUNK_DATA_PREFIX = 0x01;
exports.ONCHAIN_CONTENT_PREFIX = 0x00;
exports.OFFCHAIN_CONTENT_PREFIX = 0x01;
/**
 * @param uri   {string}
 * @returns {Uint8Array}
 */
const serializeUri = (uri) => {
    return new TextEncoder().encode(encodeURI(uri));
};
exports.serializeUri = serializeUri;
/**
 * @param bytes {Uint8Array}
 * @return {string}
 */
const parseUri = (bytes) => {
    return new TextDecoder().decode(bytes);
};
exports.parseUri = parseUri;
/**
 * @param uri {string}
 * @return {Cell}
 */
const createOffchainUriCell = (uri) => {
    const cell = new cell_1.Cell();
    cell.bits.writeUint(exports.OFFCHAIN_CONTENT_PREFIX, 8);
    cell.bits.writeBytes((0, exports.serializeUri)(uri));
    return cell;
};
exports.createOffchainUriCell = createOffchainUriCell;
/**
 * @param cell {Cell}
 * @returns {string}
 */
const parseOffchainUriCell = (cell) => {
    if (cell.bits.array[0] !== exports.OFFCHAIN_CONTENT_PREFIX) {
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
    return (0, exports.parseUri)(bytes.slice(1)); // slice OFFCHAIN_CONTENT_PREFIX
};
exports.parseOffchainUriCell = parseOffchainUriCell;
function bufferToChunks(buff, chunkSize) {
    let chunks = [];
    while (buff.byteLength > 0) {
        chunks.push(buff.slice(0, chunkSize));
        buff = buff.slice(chunkSize);
    }
    return chunks;
}
function makeSnakeCell(data) {
    let chunks = bufferToChunks(data, 127);
    let rootCell = new cell_1.Cell();
    let curCell = rootCell;
    for (let i = 0; i < chunks.length; i++) {
        let chunk = chunks[i];
        curCell.bits.writeBuffer(chunk);
        if (chunks[i + 1]) {
            let nextCell = new cell_1.Cell();
            curCell.refs.push(nextCell);
            curCell = nextCell;
        }
    }
    return rootCell;
}
exports.makeSnakeCell = makeSnakeCell;
const createOffChainContent = (content) => {
    let data = buffer_1.Buffer.from(content);
    let offChainPrefix = buffer_1.Buffer.from([exports.OFFCHAIN_CONTENT_PREFIX]);
    data = buffer_1.Buffer.concat([offChainPrefix, data]);
    return makeSnakeCell(data);
};
exports.createOffChainContent = createOffChainContent;
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
const parseAddress = (cell) => {
    let n = readIntFromBitString(cell.bits, 3, 8);
    if (n > BigInt(127)) {
        n = n - BigInt(256);
    }
    const hashPart = readIntFromBitString(cell.bits, 3 + 8, 256);
    if (n.toString(10) + ":" + hashPart.toString(16) === "0:0")
        return null;
    const s = n.toString(10) + ":" + hashPart.toString(16).padStart(64, "0");
    return new address_1.default(s);
};
exports.parseAddress = parseAddress;
/**
 * @param provider {TonHttpProvider}
 * @param address {string}
 * @return {Promise<{royalty: number, royaltyFactor: number, royaltyBase: number, royaltyAddress: Address}>}
 */
const getRoyaltyParams = async (provider, address) => {
    const result = await provider.call2(address, "royalty_params");
    const royaltyFactor = result[0].toNumber();
    const royaltyBase = result[1].toNumber();
    const royalty = royaltyFactor / royaltyBase;
    const royaltyAddress = (0, exports.parseAddress)(result[2]);
    return { royalty, royaltyBase, royaltyFactor, royaltyAddress };
};
exports.getRoyaltyParams = getRoyaltyParams;
const nftTransferBody = (params) => {
    const cell = new cell_1.Cell();
    cell.bits.writeUint(0x5fcc3d14, 32); // transfer op
    cell.bits.writeUint(params.queryId || 0, 64);
    cell.bits.writeAddress(params.newOwnerAddress);
    cell.bits.writeAddress(params.responseAddress);
    cell.bits.writeBit(false); // null custom_payload
    cell.bits.writeCoins(params.forwardAmount || new bn_js_1.default(0));
    cell.bits.writeBit(false); // forward_payload in this slice, not separate cell
    if (params.forwardPayload) {
        cell.bits.writeBytes(params.forwardPayload);
    }
    return cell;
};
exports.nftTransferBody = nftTransferBody;
const nftGetStaticDataBody = (params) => {
    const body = new cell_1.Cell();
    body.bits.writeUint(0x2fcb26a2, 32); // OP
    body.bits.writeUint(params.queryId || 0, 64); // query_id
    return body;
};
exports.nftGetStaticDataBody = nftGetStaticDataBody;
