"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JettonMinterDao = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const cell_1 = require("../../../boc/cell");
const utils_1 = require("../../../utils/utils");
const utils_2 = require("../nft/utils");
const ONCHAIN_CONTENT_PREFIX = 0x00;
const OFFCHAIN_CONTENT_PREFIX = 0x01;
const SNAKE_PREFIX = 0x00;
const jettonMetaDataKeys = [
    "name",
    "description",
    "image",
    "symbol",
    "image_data",
    "decimals",
];
// Note that this relies on what is (perhaps) an internal implementation detail:
// "ton" library dict parser converts: key (provided as buffer) => BN(base10)
// and upon parsing, it reads it back to a BN(base10)
// tl;dr if we want to read the map back to a JSON with string keys, we have to convert BN(10) back to hex
const toKey = (str) => new bn_js_1.default(str, "hex").toString(10);
const KEYLEN = 256;
function parseJettonOnchainMetadata(contentSlice) {
    const dict = contentSlice.readDict(KEYLEN, (slice) => {
        let buffer = Buffer.from("");
        const sliceToVal = (s, v, isFirst) => {
            if (isFirst && s.loadUint(8).toNumber() !== SNAKE_PREFIX)
                throw new Error("Only snake format is supported");
            v = Buffer.concat([v, s.readRemaining().array]);
            if (s.getFreeRefs() === 1) {
                v = sliceToVal(s.loadRef(), v, false);
            }
            return v;
        };
        if (slice.getFreeRefs() === 0) {
            return sliceToVal(slice, buffer, true);
        }
        return sliceToVal(slice.loadRef(), buffer, true);
    });
    const res = {};
    jettonMetaDataKeys.forEach((k) => {
        const val = dict.get(toKey((0, utils_1.sha256_hex)(k)))?.toString();
        if (val)
            res[k] = val;
    });
    return res;
}
const getJettonContent = (jettonContentCell) => {
    let jettonContentUri = null;
    let jettonContent = null;
    try {
        const contentSlice = jettonContentCell.beginParse();
        const prefix = contentSlice.loadUint(8).toNumber();
        switch (prefix) {
            case ONCHAIN_CONTENT_PREFIX: {
                jettonContent = parseJettonOnchainMetadata(contentSlice);
                break;
            }
            case OFFCHAIN_CONTENT_PREFIX: {
                jettonContentUri = (0, utils_2.parseOffchainUriCell)(jettonContentCell);
                break;
            }
            default:
                throw new Error("Unexpected jetton metadata content prefix");
        }
    }
    catch (e) {
        console.log(e);
    }
    return { jettonContentUri, jettonContent };
};
class JettonMinterDao {
    provider;
    jettonMinterAddress;
    constructor(provider, jettonMinterAddress) {
        this.provider = provider;
        this.jettonMinterAddress = jettonMinterAddress;
    }
    /**
     * @return {Promise<JettonData>}
     */
    async getJettonData() {
        const result = await this.provider.call2(this.jettonMinterAddress.toString(), "get_jetton_data");
        const totalSupply = result[0];
        const isMutable = result[1].toNumber() === -1;
        const adminAddress = (0, utils_2.parseAddress)(result[2]);
        const jettonContentCell = result[3];
        const jettonWalletCode = result[4];
        const { jettonContentUri, jettonContent } = getJettonContent(jettonContentCell);
        return {
            totalSupply,
            isMutable,
            adminAddress,
            jettonContentCell,
            jettonWalletCode,
            jettonContentUri,
            jettonContent,
        };
    }
    /**
     * params   {{ownerAddress: Address}}
     * @return {Promise<Address>}
     */
    async getJettonWalletAddress(ownerAddress) {
        const cell = new cell_1.Cell();
        cell.bits.writeAddress(ownerAddress);
        const result = await this.provider.call2(this.jettonMinterAddress.toString(), "get_wallet_address", [["tvm.Slice", (0, utils_1.bytesToBase64)(cell.toBoc(false))]]);
        return (0, utils_2.parseAddress)(result);
    }
}
exports.JettonMinterDao = JettonMinterDao;
