/// <reference types="bn.js" />
import { TonHttpProvider } from "../../providers/httpProvider";
import Address from "../../utils/address";
interface DnsConfig {
    rootDnsAddress: string;
}
export declare class Dns {
    /**
     * @param provider  {TonHttpProvider}
     */
    provider: TonHttpProvider;
    config: DnsConfig;
    constructor(provider: TonHttpProvider, config: DnsConfig);
    /**
     * @returns {Promise<Address>}
     */
    getRootDnsAddress(): Promise<Address>;
    /**
     * @param domain    {string} e.g "sub.alice.ton"
     * @param category  {string | undefined} category of requested DNS record, null for all categories
     * @param oneStep {boolean | undefined}  non-recursive
     * @returns {Promise<Cell | Address | BN | null>}
     */
    resolve(domain: string, category?: string, oneStep?: boolean): Promise<import("bn.js") | Address | import("../..").Cell | null>;
    /**
     * @param domain    {string} e.g "sub.alice.ton"
     * @returns {Promise<Address | null>}
     */
    getWalletAddress(domain: string): Promise<import("bn.js") | Address | import("../..").Cell | null>;
}
export default Dns;
