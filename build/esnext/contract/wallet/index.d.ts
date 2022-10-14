import { WalletV2ContractR1, WalletV2ContractR2 } from "./walletContractV2";
import { WalletV3ContractR1, WalletV3ContractR2 } from "./walletContractV3";
import { WalletV4ContractR1 } from "./walletContractV4";
import { WalletV4ContractR2 } from "./walletContractV4R2";
export * from "./walletContract";
export { WalletV2ContractR1, WalletV2ContractR2, WalletV3ContractR1, WalletV3ContractR2, WalletV4ContractR1, WalletV4ContractR2, };
export declare const ALL: {
    v2R1: typeof WalletV2ContractR1;
    v2R2: typeof WalletV2ContractR2;
    v3R1: typeof WalletV3ContractR1;
    v3R2: typeof WalletV3ContractR2;
    v4R1: typeof WalletV4ContractR1;
    v4R2: typeof WalletV4ContractR2;
};
export declare const LIST: (typeof WalletV2ContractR1 | typeof WalletV4ContractR1 | typeof WalletV4ContractR2)[];
export declare const defaultVersion = "v3R1";
