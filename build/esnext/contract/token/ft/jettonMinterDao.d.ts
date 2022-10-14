import BN from "bn.js";
import { Cell } from "../../../boc/cell";
import TonHttpProvider from "../../../providers/httpProvider";
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
