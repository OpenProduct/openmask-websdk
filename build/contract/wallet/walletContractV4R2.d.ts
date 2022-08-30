import BN from "bn.js";
import { Cell } from "../../boc/cell";
import HttpProvider from "../../providers/httpProvider";
import Address from "../../utils/address";
import { Options } from "../contract";
import { WalletContract } from "./walletContract";
interface DeployAndInstallPlugin {
    secretKey: Uint8Array;
    seqno: number;
    pluginWc: number;
    amount: BN;
    stateInit: Cell;
    body: Cell;
}
interface PluginParams {
    secretKey: Uint8Array;
    seqno: number;
    pluginAddress: string | Address;
    amount?: BN;
    queryId?: number;
}
export declare class WalletV4ContractR2 extends WalletContract {
    /**
     * @param provider    {HttpProvider}
     * @param options {any}
     */
    constructor(provider: HttpProvider, options: Options);
    getName(): string;
    /**
     * @override
     * @private
     * @param   seqno?   {number}
     * @param   withoutOp? {boolean}
     * @return {Cell}
     */
    createSigningMessage(seqno?: number, withoutOp?: boolean): Cell;
    /**
     * @override
     * @return {Cell} cell contains wallet data
     */
    createDataCell(): Cell;
    /**
     * @param   params {{secretKey: Uint8Array, seqno: number, pluginWc: number, amount: BN, stateInit: Cell, body: Cell}}
     */
    deployAndInstallPlugin(params: DeployAndInstallPlugin): Promise<import("../contract").ExternalMessage>;
    /**
     * @private
     * @param   params {{secretKey: Uint8Array, seqno: number, pluginAddress: string | Address, amount?: BN, queryId?: number}}
     * @param   isInstall {boolean} install or uninstall
     */
    _setPlugin(params: PluginParams, isInstall: boolean): Promise<import("../contract").ExternalMessage>;
    /**
     * @param   params {{secretKey: Uint8Array, seqno: number, pluginAddress: string | Address, amount?: BN, queryId?: number}}
     */
    installPlugin(params: PluginParams): Promise<import("../contract").ExternalMessage>;
    /**
     * @param   params {{secretKey: Uint8Array, seqno: number, pluginAddress: string | Address, amount?: BN, queryId?: number}}
     */
    removePlugin(params: PluginParams): Promise<import("../contract").ExternalMessage>;
    /**
     * @return {Promise<number>}
     */
    getWalletId(): Promise<any>;
    /**
     * @return {Promise<BN>}
     */
    getPublicKey(): Promise<any>;
    /**
     * @param pluginAddress {string | Address}
     * @return {Promise<boolean>}
     */
    isPluginInstalled(pluginAddress: string | Address): Promise<boolean>;
    /**
     * @return {Promise<string[]>} plugins addresses
     */
    getPluginsList(): Promise<any>;
}
export {};
