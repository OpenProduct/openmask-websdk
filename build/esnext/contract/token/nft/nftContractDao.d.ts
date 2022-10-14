import BN from "bn.js";
import { Cell } from "../../../boc/cell";
import TonHttpProvider from "../../../providers/httpProvider";
import Address from "../../../utils/address";
export interface NftData {
    isInitialized: boolean;
    index: number;
    itemIndex: BN;
    collectionAddress: Address | null;
    ownerAddress: Address | null;
    contentCell: Cell;
    contentUri: string | null;
}
export declare class NftContractDao {
    provider: TonHttpProvider;
    address: Address;
    constructor(provider: TonHttpProvider, address: Address);
    getData(): Promise<NftData>;
    /**
     * for single nft without collection
     * @return {Promise<{royalty: number, royaltyFactor: number, royaltyBase: number, royaltyAddress: Address}>}
     */
    getRoyaltyParams(): Promise<{
        royalty: number;
        royaltyBase: any;
        royaltyFactor: any;
        royaltyAddress: Address | null;
    }>;
}
