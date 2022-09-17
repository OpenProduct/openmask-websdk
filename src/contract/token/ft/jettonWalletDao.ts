import { Cell } from "../../../boc/cell";
import HttpProvider from "../../../providers/httpProvider";
import Address from "../../../utils/address";
import { parseAddress } from "../nft/utils";

export interface JettonWalletData {
  balance: number;
  ownerAddress: Address | null;
  jettonMinterAddress: Address | null;
  jettonWalletCode: Cell;
}

export class JettonWalletDao {
  private provider: HttpProvider;
  private jettonWalletAddress: Address;

  constructor(provider: HttpProvider, jettonWalletAddress: Address) {
    this.provider = provider;
    this.jettonWalletAddress = jettonWalletAddress;
  }

  async getData() {
    const result = await this.provider.call2(
      this.jettonWalletAddress.toString(),
      "get_wallet_data"
    );

    const balance = result[0];
    const ownerAddress = parseAddress(result[1]);
    const jettonMinterAddress = parseAddress(result[2]);
    const jettonWalletCode = result[3];

    return { balance, ownerAddress, jettonMinterAddress, jettonWalletCode };
  }
}
