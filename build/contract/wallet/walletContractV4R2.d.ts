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
    constructor(provider: HttpProvider, options: Options);
    deployAndInstallPlugin: (params: DeployAndInstallPlugin) => import("../contract").Method;
    installPlugin: (params: PluginParams) => import("../contract").Method;
    getName(): string;
    /**
     * @override
     * @private
     * @param   seqno?   {number}
     * @param   withoutOp? {boolean}
     * @return {Cell}
     */
    protected createSigningMessage(seqno?: number, withoutOp?: boolean): Cell;
    /**
     * @override
     * @return {Cell} cell contains wallet data
     */
    protected createDataCell(): Cell;
    /**
     * @param   params {{secretKey: Uint8Array, seqno: number, pluginWc: number, amount: BN, stateInit: Cell, body: Cell}}
     */
    private deployAndInstallPluginImp;
    /**
     * @private
     * @param   params {{secretKey: Uint8Array, seqno: number, pluginAddress: string | Address, amount?: BN, queryId?: number}}
     * @param   isInstall {boolean} install or uninstall
     */
    private _setPlugin;
    private installPluginImp;
    removePlugin(params: PluginParams): Promise<import("../contract").ExternalMessage>;
    /**
     * @return {Promise<number>}
     */
    getWalletId: () => Promise<number>;
    /**
     * @return {Promise<BN>}
     */
    getPublicKey: () => Promise<any>;
    /**
     * @param pluginAddress {string | Address}
     * @return {Promise<boolean>}
     */
    isPluginInstalled: (pluginAddress: string | Address) => Promise<boolean>;
    /**
     * @return {Promise<string[]>} plugins addresses
     */
    getPluginsList: () => Promise<string[]>;
}
export {};
