import BN from "bn.js";
import { Cell } from "../../../boc/cell";
import TonHttpProvider from "../../../providers/httpProvider";
import Address from "../../../utils/address";
import { NftData } from "./nftContractDao";
export interface NftCollectionData {
    nextItemIndex: number;
    itemsCount: BN;
    ownerAddress: Address | null;
    collectionContentCell: Cell;
    collectionContentUri: string | null;
}
export declare class NftCollectionDao {
    provider: TonHttpProvider;
    address: Address;
    constructor(provider: TonHttpProvider, address: Address);
    /**
     * @return {Promise<{nextItemIndex: number, itemsCount: BN, ownerAddress: Address, collectionContentCell: Cell, collectionContentUri: string|null}>}
     */
    getCollectionData(): Promise<NftCollectionData>;
    getNftItemContent(nftData: NftData): Promise<NftData>;
    /**
     * @param index {BN|number}
     * @return {Promise<Address>}
     */
    getNftItemAddressByIndex(index: BN | number): Promise<Address | null>;
    getRoyaltyParams(): Promise<{
        royalty: number;
        royaltyBase: any;
        royaltyFactor: any;
        royaltyAddress: Address | null;
    }>;
}
