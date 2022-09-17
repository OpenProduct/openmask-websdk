import BN from "bn.js";
import { Cell } from "../../../boc/cell";
import HttpProvider from "../../../providers/httpProvider";
import Address from "../../../utils/address";
export interface JettonWalletData {
    balance: BN;
    ownerAddress: Address | null;
    jettonMinterAddress: Address | null;
    jettonWalletCode: Cell;
}
export declare class JettonWalletDao {
    private provider;
    private jettonWalletAddress;
    constructor(provider: HttpProvider, jettonWalletAddress: Address);
    getData(): Promise<JettonWalletData>;
}
