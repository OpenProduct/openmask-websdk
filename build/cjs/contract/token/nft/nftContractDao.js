"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftContractDao = void 0;
const utils_1 = require("./utils");
class NftContractDao {
    provider;
    address;
    constructor(provider, address) {
        this.provider = provider;
        this.address = address;
    }
    async getData() {
        const result = await this.provider.call2(this.address.toString(), "get_nft_data");
        const isInitialized = result[0].toNumber() === -1;
        const itemIndex = result[1];
        let index = NaN;
        try {
            index = itemIndex.toNumber();
        }
        catch (e) { }
        const collectionAddress = (0, utils_1.parseAddress)(result[2]);
        const ownerAddress = isInitialized ? (0, utils_1.parseAddress)(result[3]) : null;
        const contentCell = result[4];
        let contentUri = null;
        try {
            contentUri =
                isInitialized && collectionAddress === null
                    ? (0, utils_1.parseOffchainUriCell)(contentCell)
                    : null; // single NFT without collection
        }
        catch (e) { }
        return {
            isInitialized,
            index,
            itemIndex,
            collectionAddress,
            ownerAddress,
            contentCell,
            contentUri,
        };
    }
    /**
     * for single nft without collection
     * @return {Promise<{royalty: number, royaltyFactor: number, royaltyBase: number, royaltyAddress: Address}>}
     */
    async getRoyaltyParams() {
        return (0, utils_1.getRoyaltyParams)(this.provider, this.address.toString());
    }
}
exports.NftContractDao = NftContractDao;
