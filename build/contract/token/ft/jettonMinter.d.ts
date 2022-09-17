import BN from "bn.js";
import { Cell } from "../../../boc/cell";
import HttpProvider from "../../../providers/httpProvider";
import Address from "../../../utils/address";
import { Contract } from "../../contract";
export interface JettonMinterOptions {
    adminAddress: Address;
    jettonContentUri: string;
    jettonWalletCodeHex: string;
    address?: Address;
    code?: Cell;
    wc?: number;
}
export declare class JettonMinter extends Contract {
    /**
     * @param provider
     * @param options   {{adminAddress: Address, jettonContentUri: string, jettonWalletCodeHex: string, address?: Address | string, code?: Cell}}
     */
    constructor(provider: HttpProvider, options: JettonMinterOptions);
    /**
     * @override
     * @private
     * @return {Cell} cell contains jetton minter data
     */
    createDataCell(): Cell;
    /**
     * params   {{jettonAmount: BN, destination: Address, amount: BN, queryId?: number}}
     * @return {Cell}
     */
    createMintBody(params: {
        jettonAmount: BN;
        destination: Address;
        amount: BN;
        queryId?: number;
    }): Cell;
    /**
     * params   {{queryId?: number, newAdminAddress: Address}}
     * @return {Cell}
     */
    createChangeAdminBody(params: {
        queryId?: number;
        newAdminAddress: Address;
    }): Cell;
    /**
     * params   {{jettonContentUri: string, queryId?: number}}
     * @return {Cell}
     */
    createEditContentBody(params: {
        jettonContentUri: string;
        queryId?: number;
    }): Cell;
    getJettonData(): Promise<import("./jettonMinterDao").JettonData>;
    getJettonWalletAddress(ownerAddress: Address): Promise<Address | null>;
}
