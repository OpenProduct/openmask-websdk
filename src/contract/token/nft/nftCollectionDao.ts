import BN from "bn.js";
import { Cell } from "../../../boc/cell";
import TonHttpProvider from "../../../providers/httpProvider";
import Address from "../../../utils/address";
import { bytesToBase64 } from "../../../utils/utils";
import { NftData } from "./nftContractDao";
import { getRoyaltyParams, parseAddress, parseOffchainUriCell } from "./utils";

export interface NftCollectionData {
  nextItemIndex: number;
  itemsCount: BN;
  ownerAddress: Address | null;
  collectionContentCell: Cell;
  collectionContentUri: string | null;
}

export class NftCollectionDao {
  provider: TonHttpProvider;
  address: Address;

  constructor(provider: TonHttpProvider, address: Address) {
    this.provider = provider;
    this.address = address;
  }

  /**
   * @return {Promise<{nextItemIndex: number, itemsCount: BN, ownerAddress: Address, collectionContentCell: Cell, collectionContentUri: string|null}>}
   */
  async getCollectionData(): Promise<NftCollectionData> {
    const result = await this.provider.call2(
      this.address.toString(),
      "get_collection_data"
    );

    const itemsCount = result[0];
    let nextItemIndex = NaN;
    try {
      nextItemIndex = itemsCount.toNumber();
    } catch (e) {}
    const collectionContentCell = result[1];
    let collectionContentUri = null;
    try {
      collectionContentUri = parseOffchainUriCell(collectionContentCell);
    } catch (e) {}
    const ownerAddress = parseAddress(result[2]);

    return {
      nextItemIndex,
      itemsCount,
      ownerAddress,
      collectionContentCell,
      collectionContentUri,
    };
  }

  async getNftItemContent(nftData: NftData): Promise<NftData> {
    if (nftData.isInitialized) {
      const result = await this.provider.call2(
        this.address.toString(),
        "get_nft_content",
        [
          ["num", nftData.itemIndex.toString(10)],
          ["tvm.Cell", bytesToBase64(await nftData.contentCell.toBoc(false))],
        ]
      );
      nftData.contentUri = null;
      try {
        nftData.contentUri = parseOffchainUriCell(result);
      } catch (e) {}
    }
    return nftData;
  }

  /**
   * @param index {BN|number}
   * @return {Promise<Address>}
   */
  async getNftItemAddressByIndex(index: BN | number) {
    index = new BN(index);
    const result = await this.provider.call2(
      this.address.toString(),
      "get_nft_address_by_index",
      [["num", index.toString(10)]]
    );

    return parseAddress(result);
  }

  async getRoyaltyParams() {
    return getRoyaltyParams(this.provider, this.address.toString());
  }
}
