import BN from "bn.js";
import { Cell } from "../../../boc/cell";
import TonHttpProvider from "../../../providers/httpProvider";
import Address from "../../../utils/address";
import { bytesToBase64 } from "../../../utils/utils";
import { parseAddress, parseOffchainUriCell } from "../nft/utils";

export interface JettonData {
  totalSupply: BN;
  isMutable: boolean;
  adminAddress: Address | null;
  jettonContentCell: Cell;
  jettonContentUri: string | null;
  jettonWalletCode: Cell;
}

export class JettonMinterDao {
  private provider: TonHttpProvider;
  private jettonMinterAddress: Address;

  constructor(provider: TonHttpProvider, jettonMinterAddress: Address) {
    this.provider = provider;
    this.jettonMinterAddress = jettonMinterAddress;
  }

  /**
   * @return {Promise<JettonData>}
   */
  async getJettonData(): Promise<JettonData> {
    const result = await this.provider.call2(
      this.jettonMinterAddress.toString(),
      "get_jetton_data"
    );

    const totalSupply = result[0];
    const isMutable = result[1].toNumber() === -1;
    const adminAddress = parseAddress(result[2]);
    const jettonContentCell = result[3];
    let jettonContentUri = null;
    try {
      jettonContentUri = parseOffchainUriCell(jettonContentCell);
    } catch (e) {}
    const jettonWalletCode = result[4];

    return {
      totalSupply,
      isMutable,
      adminAddress,
      jettonContentCell,
      jettonContentUri,
      jettonWalletCode,
    };
  }

  /**
   * params   {{ownerAddress: Address}}
   * @return {Promise<Address>}
   */
  async getJettonWalletAddress(ownerAddress: Address) {
    const cell = new Cell();
    cell.bits.writeAddress(ownerAddress);

    const result = await this.provider.call2(
      this.jettonMinterAddress.toString(),
      "get_wallet_address",
      [["tvm.Slice", bytesToBase64(await cell.toBoc(false))]]
    );
    return parseAddress(result);
  }
}
