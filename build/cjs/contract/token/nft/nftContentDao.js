"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftContentDao = void 0;
const nftCollectionDao_1 = require("./nftCollectionDao");
const nftContractDao_1 = require("./nftContractDao");
/**
 * Documentation: https://github.com/ton-blockchain/TIPs/issues/62
 */
class NftContentDao {
    provider;
    address;
    nftContractDao;
    constructor(provider, address) {
        this.provider = provider;
        this.address = address;
        this.nftContractDao = new nftContractDao_1.NftContractDao(provider, address);
    }
    getData = async () => {
        const data = await this.nftContractDao.getData();
        if (data.collectionAddress == null) {
            return data;
        }
        const collection = new nftCollectionDao_1.NftCollectionDao(this.provider, data.collectionAddress);
        return await collection.getNftItemContent(data);
    };
}
exports.NftContentDao = NftContentDao;
