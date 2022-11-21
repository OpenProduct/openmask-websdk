import BN from "bn.js";
import { Cell } from "../../../boc/cell";
import { Slice } from "../../../boc/slice";
import TonHttpProvider from "../../../providers/httpProvider";
import Address from "../../../utils/address";
import { bytesToBase64, sha256_hex } from "../../../utils/utils";
import { parseAddress, parseOffchainUriCell } from "../nft/utils";

const ONCHAIN_CONTENT_PREFIX = 0x00;
const OFFCHAIN_CONTENT_PREFIX = 0x01;
const SNAKE_PREFIX = 0x00;

const jettonMetaDataKeys = [
  "name",
  "description",
  "image",
  "symbol",
  "image_data",
  "decimals",
] as const;

type JettonMetaDataKeys = typeof jettonMetaDataKeys[number];

export interface JettonContent {
  jettonContentUri: string | null;
  jettonContent: Partial<Record<JettonMetaDataKeys, string>> | null;
}

export interface JettonData extends JettonContent {
  totalSupply: BN;
  isMutable: boolean;
  adminAddress: Address | null;
  jettonContentCell: Cell;
  jettonWalletCode: Cell;
}

// Note that this relies on what is (perhaps) an internal implementation detail:
// "ton" library dict parser converts: key (provided as buffer) => BN(base10)
// and upon parsing, it reads it back to a BN(base10)
// tl;dr if we want to read the map back to a JSON with string keys, we have to convert BN(10) back to hex
const toKey = (str: string) => new BN(str, "hex").toString(10);
const KEYLEN = 256;

function parseJettonOnchainMetadata(contentSlice: Slice) {
  const dict = contentSlice.readDict(KEYLEN, (slice) => {
    let buffer = Buffer.from("");

    const sliceToVal = (s: Slice, v: Buffer, isFirst: boolean) => {
      if (isFirst && s.loadUint(8).toNumber() !== SNAKE_PREFIX)
        throw new Error("Only snake format is supported");

      v = Buffer.concat([v, s.readRemaining().array]);
      if (s.getFreeRefs() === 1) {
        v = sliceToVal(s.loadRef(), v, false);
      }

      return v;
    };

    if (slice.getFreeRefs() === 0) {
      return sliceToVal(slice, buffer, true);
    }
    return sliceToVal(slice.loadRef(), buffer, true);
  });

  const res: Partial<Record<JettonMetaDataKeys, string>> = {};

  jettonMetaDataKeys.forEach((k) => {
    const val = dict.get(toKey(sha256_hex(k)))?.toString();
    if (val) res[k] = val;
  });

  return res;
}

const getJettonContent = (jettonContentCell: Cell): JettonContent => {
  let jettonContentUri: string | null = null;
  let jettonContent: Partial<Record<JettonMetaDataKeys, string>> | null = null;

  try {
    const contentSlice = jettonContentCell.beginParse();
    const prefix = contentSlice.loadUint(8).toNumber();

    switch (prefix) {
      case ONCHAIN_CONTENT_PREFIX: {
        jettonContent = parseJettonOnchainMetadata(contentSlice);
        break;
      }
      case OFFCHAIN_CONTENT_PREFIX: {
        jettonContentUri = parseOffchainUriCell(jettonContentCell);
        break;
      }
      default:
        throw new Error("Unexpected jetton metadata content prefix");
    }
  } catch (e) {
    console.log(e);
  }

  return { jettonContentUri, jettonContent };
};

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
    const jettonWalletCode = result[4];

    const { jettonContentUri, jettonContent } =
      getJettonContent(jettonContentCell);

    return {
      totalSupply,
      isMutable,
      adminAddress,
      jettonContentCell,
      jettonWalletCode,

      jettonContentUri,
      jettonContent,
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
      [["tvm.Slice", bytesToBase64(cell.toBoc(false))]]
    );
    return parseAddress(result);
  }
}
