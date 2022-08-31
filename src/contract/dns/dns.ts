import { HttpProvider } from "../../providers/httpProvider";
import Address from "../../utils/address";
import { dnsResolve, DNS_CATEGORY_WALLET } from "./utils";

interface DnsConfig {
  rootDnsAddress: string;
}

export class Dns {
  /**
   * @param provider  {HttpProvider}
   */
  provider: HttpProvider;
  config: DnsConfig;

  constructor(provider: HttpProvider, config: DnsConfig) {
    this.provider = provider;
    this.config = config;
  }

  /**
   * @returns {Promise<Address>}
   */
  async getRootDnsAddress() {
    return new Address(this.config.rootDnsAddress);
  }

  /**
   * @param domain    {string} e.g "sub.alice.ton"
   * @param category  {string | undefined} category of requested DNS record, null for all categories
   * @param oneStep {boolean | undefined}  non-recursive
   * @returns {Promise<Cell | Address | BN | null>}
   */
  async resolve(domain: string, category?: string, oneStep?: boolean) {
    const rootDnsAddress = await this.getRootDnsAddress();
    return dnsResolve(
      this.provider,
      rootDnsAddress.toString(),
      domain,
      category,
      oneStep
    );
  }

  /**
   * @param domain    {string} e.g "sub.alice.ton"
   * @returns {Promise<Address | null>}
   */
  getWalletAddress(domain: string) {
    return this.resolve(domain, DNS_CATEGORY_WALLET);
  }
}

export default Dns;
