import HttpProvider from "../../../providers/httpProvider";
import Address from "../../../utils/address";
import { NftCollectionDao } from "./nftCollectionDao";
import { NftContractDao, NftData } from "./nftContractDao";

/**
 * Documentation: https://github.com/ton-blockchain/TIPs/issues/62
 */
export class NftContentDao {
  provider: HttpProvider;
  address: Address;
  nftContractDao: NftContractDao;

  constructor(provider: HttpProvider, address: Address) {
    this.provider = provider;
    this.address = address;
    this.nftContractDao = new NftContractDao(provider, address);
  }

  getData = async (): Promise<NftData> => {
    const data = await this.nftContractDao.getData();

    if (data.collectionAddress == null) {
      return data;
    }
    const collection = new NftCollectionDao(
      this.provider,
      data.collectionAddress
    );

    return await collection.getNftItemContent(data);
  };
}
