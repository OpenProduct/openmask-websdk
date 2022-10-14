import { NftCollectionDao } from "./nftCollectionDao";
import { NftContractDao } from "./nftContractDao";
/**
 * Documentation: https://github.com/ton-blockchain/TIPs/issues/62
 */
export class NftContentDao {
    provider;
    address;
    nftContractDao;
    constructor(provider, address) {
        this.provider = provider;
        this.address = address;
        this.nftContractDao = new NftContractDao(provider, address);
    }
    getData = async () => {
        const data = await this.nftContractDao.getData();
        if (data.collectionAddress == null) {
            return data;
        }
        const collection = new NftCollectionDao(this.provider, data.collectionAddress);
        return await collection.getNftItemContent(data);
    };
}
