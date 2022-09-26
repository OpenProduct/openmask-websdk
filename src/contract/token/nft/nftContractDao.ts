import HttpProvider from "../../../providers/httpProvider";
import Address from "../../../utils/address";
import { getRoyaltyParams, parseAddress, parseOffchainUriCell } from "./utils";

export class NftContractDao {
  provider: HttpProvider;
  address: Address;

  constructor(provider: HttpProvider, address: Address) {
    this.provider = provider;
    this.address = address;
  }

  async getData() {
    const result = await this.provider.call2(
      this.address.toString(),
      "get_nft_data"
    );

    const isInitialized = result[0].toNumber() === -1;
    const itemIndex = result[1];
    let index = NaN;
    try {
      index = itemIndex.toNumber();
    } catch (e) {}
    const collectionAddress = parseAddress(result[2]);
    const ownerAddress = isInitialized ? parseAddress(result[3]) : null;
    const contentCell = result[4];

    let contentUri = null;
    try {
      contentUri =
        isInitialized && collectionAddress === null
          ? parseOffchainUriCell(contentCell)
          : null; // single NFT without collection
    } catch (e) {}

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
    return getRoyaltyParams(this.provider, this.address.toString());
  }
}
