import BN from "bn.js";
import { Cell } from "../../../boc/cell";
import TonHttpProvider from "../../../providers/httpProvider";
import Address from "../../../utils/address";
import { Contract } from "../../contract";
export interface NftItemOptions {
    wc?: number;
    index: number | BN;
    collectionAddress: Address;
    address?: Address | string;
    code?: Cell;
}
export declare class NftItem extends Contract {
    constructor(provider: TonHttpProvider, options: NftItemOptions);
    /**
     * @override
     * @private
     * @return {Cell} cell contains nft data
     */
    createDataCell(): Cell;
    /**
     * @return {Promise<{isInitialized: boolean, index: number, itemIndex: BN, collectionAddress: Address|null, ownerAddress: Address|null, contentCell: Cell, contentUri: string|null}>}
     */
    getData: () => Promise<import("./nftContractDao").NftData>;
    createTransferBody: (params: {
        queryId?: number | undefined;
        newOwnerAddress: Address;
        forwardAmount?: BN | undefined;
        forwardPayload?: Uint8Array | undefined;
        responseAddress: Address;
    }) => Cell;
    createGetStaticDataBody: (params: {
        queryId?: number | undefined;
    }) => Cell;
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
