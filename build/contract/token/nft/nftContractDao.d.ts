import HttpProvider from "../../../providers/httpProvider";
import Address from "../../../utils/address";
export declare class NftContractDao {
    provider: HttpProvider;
    address: Address;
    constructor(provider: HttpProvider, address: Address);
    getData(): Promise<{
        isInitialized: boolean;
        index: number;
        itemIndex: any;
        collectionAddress: Address | null;
        ownerAddress: Address | null;
        contentCell: any;
        contentUri: string | null;
    }>;
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
