import BN from "bn.js";
import { Cell } from "../../../boc/cell";
import HttpProvider from "../../../providers/httpProvider";
import Address from "../../../utils/address";
export interface JettonData {
    totalSupply: BN;
    isMutable: boolean;
    adminAddress: Address | null;
    jettonContentCell: Cell;
    jettonContentUri: string | null;
    jettonWalletCode: Cell;
}
export declare class JettonMinterDao {
    private provider;
    private jettonMinterAddress;
    constructor(provider: HttpProvider, jettonMinterAddress: Address);
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
