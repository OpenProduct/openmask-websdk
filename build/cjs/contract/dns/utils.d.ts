import BN from "bn.js";
import { Cell } from "../../boc/cell";
import TonHttpProvider from "../../providers/httpProvider";
import Address from "../../utils/address";
export declare const DNS_CATEGORY_NEXT_RESOLVER = "dns_next_resolver";
export declare const DNS_CATEGORY_WALLET = "wallet";
export declare const DNS_CATEGORY_SITE = "site";
/**
 * @param category  {string | undefined}
 * @return  {BN}
 */
export declare const categoryToBN: (category: string | undefined) => BN;
/**
 * @param smartContractAddress   {Address}
 * @return {Cell}
 */
export declare const createSmartContractAddressRecord: (smartContractAddress: Address) => Cell;
/**
 * @param adnlAddress   {BN}
 * @return {Cell}
 */
export declare const createAdnlAddressRecord: (adnlAddress: BN) => Cell;
/**
 * @param smartContractAddress   {Address}
 * @return {Cell}
 */
export declare const createNextResolverRecord: (smartContractAddress: Address) => Cell;
/**
 * @param cell  {Cell}
 * @return {Address|null}
 */
export declare const parseSmartContractAddressRecord: (cell: Cell) => Address | null;
/**
 * @param cell  {Cell}
 * @return {Address|null}
 */
export declare const parseNextResolverRecord: (cell: Cell) => Address | null;
/**
 * @param provider  {TonHttpProvider}
 * @param rootDnsAddress {string} address of root DNS smart contract
 * @param domain    {string} e.g "sub.alice.ton"
 * @param category  {string | undefined} category of requested DNS record
 * @param oneStep {boolean | undefined} non-recursive
 * @returns {Promise<Cell | Address | BN | null>}
 */
export declare const dnsResolve: (provider: TonHttpProvider, rootDnsAddress: string, domain: string, category: string | undefined, oneStep: boolean | undefined) => Promise<BN | Address | Cell | null>;
