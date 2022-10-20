"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TonDns = void 0;
const address_1 = __importDefault(require("../../utils/address"));
const utils_1 = require("./utils");
class TonDns {
    /**
     * @param provider  {TonHttpProvider}
     */
    provider;
    config;
    constructor(provider, config) {
        this.provider = provider;
        this.config = config;
    }
    /**
     * @returns {Promise<Address>}
     */
    async getRootDnsAddress() {
        return new address_1.default(this.config.rootDnsAddress);
    }
    /**
     * @param domain    {string} e.g "sub.alice.ton"
     * @param category  {string | undefined} category of requested DNS record, null for all categories
     * @param oneStep {boolean | undefined}  non-recursive
     * @returns {Promise<Cell | Address | BN | null>}
     */
    async resolve(domain, category, oneStep) {
        const rootDnsAddress = await this.getRootDnsAddress();
        return (0, utils_1.dnsResolve)(this.provider, rootDnsAddress.toString(), domain, category, oneStep);
    }
    /**
     * @param domain    {string} e.g "sub.alice.ton"
     * @returns {Promise<Address | null>}
     */
    getWalletAddress(domain) {
        return this.resolve(domain, utils_1.DNS_CATEGORY_WALLET);
    }
}
exports.TonDns = TonDns;
exports.default = TonDns;
