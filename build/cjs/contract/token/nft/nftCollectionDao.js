"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftCollectionDao = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const utils_1 = require("../../../utils/utils");
const utils_2 = require("./utils");
class NftCollectionDao {
    provider;
    address;
    constructor(provider, address) {
        this.provider = provider;
        this.address = address;
    }
    /**
     * @return {Promise<{nextItemIndex: number, itemsCount: BN, ownerAddress: Address, collectionContentCell: Cell, collectionContentUri: string|null}>}
     */
    async getCollectionData() {
        const result = await this.provider.call2(this.address.toString(), "get_collection_data");
        const itemsCount = result[0];
        let nextItemIndex = NaN;
        try {
            nextItemIndex = itemsCount.toNumber();
        }
        catch (e) { }
        const collectionContentCell = result[1];
        let collectionContentUri = null;
        try {
            collectionContentUri = (0, utils_2.parseOffchainUriCell)(collectionContentCell);
        }
        catch (e) { }
        const ownerAddress = (0, utils_2.parseAddress)(result[2]);
        return {
            nextItemIndex,
            itemsCount,
            ownerAddress,
            collectionContentCell,
            collectionContentUri,
        };
    }
    async getNftItemContent(nftData) {
        if (nftData.isInitialized) {
            const result = await this.provider.call2(this.address.toString(), "get_nft_content", [
                ["num", nftData.itemIndex.toString(10)],
                ["tvm.Cell", (0, utils_1.bytesToBase64)(await nftData.contentCell.toBoc(false))],
            ]);
            nftData.contentUri = null;
            try {
                nftData.contentUri = (0, utils_2.parseOffchainUriCell)(result);
            }
            catch (e) { }
        }
        return nftData;
    }
    /**
     * @param index {BN|number}
     * @return {Promise<Address>}
     */
    async getNftItemAddressByIndex(index) {
        index = new bn_js_1.default(index);
        const result = await this.provider.call2(this.address.toString(), "get_nft_address_by_index", [["num", index.toString(10)]]);
        return (0, utils_2.parseAddress)(result);
    }
    async getRoyaltyParams() {
        return (0, utils_2.getRoyaltyParams)(this.provider, this.address.toString());
    }
}
exports.NftCollectionDao = NftCollectionDao;
