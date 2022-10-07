import BN from "bn.js";
import { Cell } from "../boc/cell";
import HttpProvider, { EstimateFee } from "../providers/httpProvider";
import Address from "../utils/address";
import { bytesToBase64, bytesToHex } from "../utils/utils";

export interface ExternalMessage {
  address: Address;
  message: Cell;
  body: Cell;
  signature?: Uint8Array;
  signingMessage?: Cell;
  stateInit: Cell | null;
  code: Cell | null;
  data: Cell | null;
}

export type Options = {
  code?: Cell;
  data?: Cell;
  address?: Address | string;
  wc?: number;
  [key: string]: any;
};

export interface Method {
  getQuery: () => Promise<Cell>;
  send: () => Promise<void>;
  estimateFee: () => Promise<EstimateFee>;
}

export class Contract {
  provider: HttpProvider;
  options: Options;
  address: Address | null;
  methods: Record<string, any>;

  /**
   * @param provider    {HttpProvider}
   * @param options    {{code?: Cell, address?: Address | string, wc?: number}}
   */
  constructor(provider: HttpProvider, options: Options) {
    this.provider = provider;
    this.options = options;
    this.address = options.address ? new Address(options.address) : null;
    if (!options.wc) options.wc = this.address ? this.address.wc : 0;
    this.methods = {};
  }

  /**
   * @return {Promise<Address>}
   */
  public async getAddress() {
    if (!this.address) {
      this.address = (await this.createStateInit()).address;
    }
    return this.address;
  }

  /**
   * @private
   * @return {Cell} cell contains contact code
   */
  protected createCodeCell() {
    if (!this.options.code)
      throw new Error("Contract: options.code is not defined");
    return this.options.code;
  }

  /**
   * Method to override
   * @protected
   * @return {Cell} cell contains contract data
   */
  protected createDataCell() {
    if (!this.options.data) {
      return new Cell();
    }
    return this.options.data;
  }

  /**
   * @protected
   * @return {Promise<{stateInit: Cell, address: Address, code: Cell, data: Cell}>}
   */
  protected async createStateInit() {
    const codeCell = this.createCodeCell();
    const dataCell = this.createDataCell();

    const stateInit = Contract.createStateInit(codeCell, dataCell);
    const stateInitHash = await stateInit.hash();
    const address = new Address(
      this.options.wc + ":" + bytesToHex(stateInitHash)
    );
    return {
      stateInit: stateInit,
      address: address,
      code: codeCell,
      data: dataCell,
    };
  }

  // _ split_depth:(Maybe (## 5)) special:(Maybe TickTock)
  // code:(Maybe ^Cell) data:(Maybe ^Cell)
  // library:(Maybe ^Cell) = StateInit;
  /**
   * @param code  {Cell}
   * @param data  {Cell}
   * @param library {null}
   * @param splitDepth {null}
   * @param ticktock  {null}
   * @return {Cell}
   */
  static createStateInit(
    code: Uint8Array | Cell,
    data: Cell,
    library = null,
    splitDepth = null,
    ticktock = null
  ) {
    if (library) throw "Library in state init is not implemented";
    if (splitDepth) throw "Split depth in state init is not implemented";
    if (ticktock) throw "Ticktock in state init is not implemented";

    const stateInit = new Cell();

    stateInit.bits.writeBitArray([
      Boolean(splitDepth),
      Boolean(ticktock),
      Boolean(code),
      Boolean(data),
      Boolean(library),
    ]);
    if (code) stateInit.refs.push(code);
    if (data) stateInit.refs.push(data);
    if (library) stateInit.refs.push(library);
    return stateInit;
  }

  // extra_currencies$_ dict:(HashmapE 32 (VarUInteger 32))
  // = ExtraCurrencyCollection;
  // currencies$_ grams:Grams other:ExtraCurrencyCollection
  // = CurrencyCollection;

  //int_msg_info$0 ihr_disabled:Bool bounce:Bool
  //src:MsgAddressInt dest:MsgAddressInt
  //value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
  //created_lt:uint64 created_at:uint32 = CommonMsgInfo;
  /**
   * @param dest  {Address | string}
   * @param gramValue  {number | BN}
   * @param ihrDisabled  {boolean}
   * @param bounce  {null | boolean}
   * @param bounced {boolean}
   * @param src  {Address | string}
   * @param currencyCollection  {null}
   * @param ihrFees  {number | BN}
   * @param fwdFees  {number | BN}
   * @param createdLt  {number | BN}
   * @param createdAt  {number | BN}
   * @return {Cell}
   */
  static createInternalMessageHeader(
    dest: Address | string,
    gramValue: number | BN = 0,
    ihrDisabled: boolean = true,
    bounce: null | boolean = null,
    bounced: boolean = false,
    src: Address | string | null = null,
    currencyCollection = null,
    ihrFees: number | BN = 0,
    fwdFees: number | BN = 0,
    createdLt: number | BN = 0,
    createdAt: number | BN = 0
  ) {
    const message = new Cell();
    message.bits.writeBit(false);
    message.bits.writeBit(ihrDisabled);
    if (!(bounce === null)) {
      message.bits.writeBit(bounce);
    } else {
      message.bits.writeBit(new Address(dest).isBounceable);
    }
    message.bits.writeBit(bounced);
    message.bits.writeAddress(src ? new Address(src) : null);
    message.bits.writeAddress(new Address(dest));
    message.bits.writeGrams(gramValue);
    if (currencyCollection) {
      throw "Currency collections are not implemented yet";
    }
    message.bits.writeBit(Boolean(currencyCollection));
    message.bits.writeGrams(ihrFees);
    message.bits.writeGrams(fwdFees);
    message.bits.writeUint(createdLt, 64);
    message.bits.writeUint(createdAt, 32);
    return message;
  }

  //ext_in_msg_info$10 src:MsgAddressExt dest:MsgAddressInt
  //import_fee:Grams = CommonMsgInfo;
  /**
   * @param dest  {Address | string}
   * @param src  {Address | string}
   * @param importFee  {number | BN}
   * @return {Cell}
   */
  static createExternalMessageHeader(
    dest: Address | string,
    src: Address | string | null = null,
    importFee = 0
  ) {
    const message = new Cell();
    message.bits.writeUint(2, 2);
    message.bits.writeAddress(src ? new Address(src) : null);
    message.bits.writeAddress(new Address(dest));
    message.bits.writeGrams(importFee);
    return message;
  }

  //tblkch.pdf, page 57
  /**
   * Create CommonMsgInfo contains header, stateInit, body
   * @param header {Cell}
   * @param stateInit?  {Cell}
   * @param body?  {Cell}
   * @return {Cell}
   */
  static createCommonMsgInfo(
    header: Cell,
    stateInit: Cell | null = null,
    body: Cell | null = null
  ) {
    const commonMsgInfo = new Cell();
    commonMsgInfo.writeCell(header);

    if (stateInit) {
      commonMsgInfo.bits.writeBit(true);
      //-1:  need at least one bit for body
      // TODO we also should check for free refs here
      if (
        commonMsgInfo.bits.getFreeBits() - 1 >=
        stateInit.bits.getUsedBits()
      ) {
        commonMsgInfo.bits.writeBit(false);
        commonMsgInfo.writeCell(stateInit);
      } else {
        commonMsgInfo.bits.writeBit(true);
        commonMsgInfo.refs.push(stateInit);
      }
    } else {
      commonMsgInfo.bits.writeBit(false);
    }
    // TODO we also should check for free refs here
    if (body) {
      if (commonMsgInfo.bits.getFreeBits() >= body.bits.getUsedBits()) {
        commonMsgInfo.bits.writeBit(false);
        commonMsgInfo.writeCell(body);
      } else {
        commonMsgInfo.bits.writeBit(true);
        commonMsgInfo.refs.push(body);
      }
    } else {
      commonMsgInfo.bits.writeBit(false);
    }
    return commonMsgInfo;
  }

  static createMethod(
    provider: HttpProvider,
    queryPromise: Promise<ExternalMessage>
  ): Method {
    return {
      getQuery: async () => {
        return (await queryPromise).message;
      },
      send: async () => {
        const query = await queryPromise;
        const boc = bytesToBase64(await query.message.toBoc(false));
        return provider.sendBoc(boc);
      },
      estimateFee: async () => {
        const query = await queryPromise;
        const serialized =
          query.code && query.data // deploy
            ? {
                address: query.address.toString(true, true, false),
                body: bytesToBase64(await query.body.toBoc(false)),
                init_code: bytesToBase64(await query.code.toBoc(false)),
                init_data: bytesToBase64(await query.data.toBoc(false)),
              }
            : {
                address: query.address.toString(true, true, true),
                body: bytesToBase64(await query.body.toBoc(false)),
              };

        return provider.getEstimateFee(serialized);
      },
    };
  }
}
