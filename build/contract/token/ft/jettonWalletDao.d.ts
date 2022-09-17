import { Cell } from "../../../boc/cell";
import HttpProvider from "../../../providers/httpProvider";
import Address from "../../../utils/address";
export interface JettonWalletData {
    balance: number;
    ownerAddress: Address | null;
    jettonMinterAddress: Address | null;
    jettonWalletCode: Cell;
}
export declare class JettonWalletDao {
    private provider;
    private jettonWalletAddress;
    constructor(provider: HttpProvider, jettonWalletAddress: Address);
    getData(): Promise<{
        balance: any;
        ownerAddress: Address | null;
        jettonMinterAddress: Address | null;
        jettonWalletCode: any;
    }>;
}
