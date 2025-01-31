import TonHttpProvider from "../../../providers/httpProvider";
import Address from "../../../utils/address";
import { NftContractDao, NftData } from "./nftContractDao";
/**
 * Documentation: https://github.com/ton-blockchain/TIPs/issues/62
 */
export declare class NftContentDao {
    provider: TonHttpProvider;
    address: Address;
    nftContractDao: NftContractDao;
    constructor(provider: TonHttpProvider, address: Address);
    getData: () => Promise<NftData>;
}
