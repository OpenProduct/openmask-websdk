import BN from "bn.js";
import { Cell } from "../../../boc/cell";
import HttpProvider from "../../../providers/httpProvider";
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
    provider: HttpProvider;
    address: Address;
    constructor(provider: HttpProvider, address: Address);
    /**
     * @return {Promise<{nextItemIndex: number, itemsCount: BN, ownerAddress: Address, collectionContentCell: Cell, collectionContentUri: string|null}>}
     */
    getCollectionData(): Promise<NftCollectionData>;
    getNftItemContent(nftAddress: Address): Promise<NftData>;
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
