import { WalletV2ContractR1, WalletV2ContractR2 } from "./walletContractV2";
import { WalletV3ContractR1, WalletV3ContractR2 } from "./walletContractV3";
import { WalletV4ContractR1 } from "./walletContractV4";
import { WalletV4ContractR2 } from "./walletContractV4R2";

export const ALL = {
  v2R1: WalletV2ContractR1,
  v2R2: WalletV2ContractR2,
  v3R1: WalletV3ContractR1,
  v3R2: WalletV3ContractR2,
  v4R1: WalletV4ContractR1,
  v4R2: WalletV4ContractR2,
};

export const LIST = [
  WalletV2ContractR1,
  WalletV2ContractR2,
  WalletV3ContractR1,
  WalletV3ContractR2,
  WalletV4ContractR1,
  WalletV4ContractR2,
];

export const defaultVersion = "v3R1";
