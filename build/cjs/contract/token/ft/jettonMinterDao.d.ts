import BN from "bn.js";
import { Cell } from "../../../boc/cell";
import TonHttpProvider from "../../../providers/httpProvider";
import Address from "../../../utils/address";
declare const jettonMetaDataKeys: readonly ["name", "description", "image", "symbol", "image_data", "decimals"];
declare type JettonMetaDataKeys = typeof jettonMetaDataKeys[number];
export interface JettonContent {
    jettonContentUri: string | null;
    jettonContent: Partial<Record<JettonMetaDataKeys, string>> | null;
}
export interface JettonData extends JettonContent {
    totalSupply: BN;
    isMutable: boolean;
    adminAddress: Address | null;
    jettonContentCell: Cell;
    jettonWalletCode: Cell;
}
export declare class JettonMinterDao {
    private provider;
    private jettonMinterAddress;
    constructor(provider: TonHttpProvider, jettonMinterAddress: Address);
    /**
     * @return {Promise<JettonData>}
     */
    getJettonData(): Promise<JettonData>;
    /**
     * params   {{ownerAddress: Address}}
     * @return {Promise<Address>}
     */
    getJettonWalletAddress(ownerAddress: Address): Promise<Address | null>;
}
export {};
