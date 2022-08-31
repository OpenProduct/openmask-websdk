import BN from "bn.js";
import nacl from "tweetnacl";
import { Cell } from "../../boc/cell";
import HttpProvider from "../../providers/httpProvider";
import Address from "../../utils/address";
import { Contract, ExternalMessage, Method, Options } from "../contract";

export interface TransferParams {
  secretKey: Uint8Array;
  toAddress: Address | string;
  amount: BN | number;
  seqno: number;
  payload: string | Uint8Array | Cell;
  sendMode: number;
  stateInit?: Cell;
}

export interface BaseMethods {
  seqno: () => { call: () => Promise<number | null> };
  transfer: (params: TransferParams) => Method;
}

/**
 * Abstract standard wallet class
 */
export class WalletContract extends Contract {
  deploy: (secretKey: Uint8Array) => void;

  constructor(provider: HttpProvider, options: Options) {
    if (!options.publicKey && !options.address)
      throw new Error(
        "WalletContract required publicKey or address in options"
      );
    super(provider, options);

    /**
     * @param secretKey {Uint8Array}
     */
    this.deploy = (secretKey: Uint8Array) =>
      Contract.createMethod(
        provider,
        this.createInitExternalMessage(secretKey)
      );
  }

  public transfer = (params: TransferParams) =>
    Contract.createMethod(
      this.provider,
      this.createTransferMessage(
        params.secretKey,
        params.toAddress,
        params.amount,
        params.seqno,
        params.payload,
        params.sendMode,
        !Boolean(params.secretKey),
        params.stateInit
      )
    );

  public seqno = () => {
    return {
      call: async () => {
        const address = await this.getAddress();
        let n = null;
        try {
          n = this.provider.getSeqno(address.toString());
        } catch (e) {}
        return n;
      },
    };
  };

  getName() {
    throw new Error("override me");
  }

  /**
   * @override
   * @protected
   * @return {Cell} cell contains wallet data
   */
  protected createDataCell() {
    // 4 byte seqno, 32 byte publicKey
    const cell = new Cell();
    cell.bits.writeUint(0, 32); // seqno
    cell.bits.writeBytes(this.options.publicKey);
    return cell;
  }

  /**
   * @protected
   * @param   seqno?   {number}
   * @return {Cell}
   */
  protected createSigningMessage(seqno?: number) {
    seqno = seqno || 0;
    const cell = new Cell();
    cell.bits.writeUint(seqno, 32);
    return cell;
  }

  /**
   * External message for initialization
   * @param secretKey  {Uint8Array} nacl.KeyPair.secretKey
   * @return {{address: Address, message: Cell, body: Cell, sateInit: Cell, code: Cell, data: Cell}}
   */
  async createInitExternalMessage(
    secretKey: Uint8Array
  ): Promise<ExternalMessage> {
    if (!this.options.publicKey) {
      const keyPair = nacl.sign.keyPair.fromSecretKey(secretKey);
      this.options.publicKey = keyPair.publicKey;
    }
    const { stateInit, address, code, data } = await this.createStateInit();

    const signingMessage = this.createSigningMessage();
    const signature = nacl.sign.detached(
      await signingMessage.hash(),
      secretKey
    );

    const body = new Cell();
    body.bits.writeBytes(signature);
    body.writeCell(signingMessage);

    const header = Contract.createExternalMessageHeader(address);
    const externalMessage = Contract.createCommonMsgInfo(
      header,
      stateInit,
      body
    );

    return {
      address: address,
      message: externalMessage,

      body,
      signingMessage,
      stateInit,
      code,
      data,
    };
  }

  /**
   * @protected
   * @param signingMessage {Cell}
   * @param secretKey {Uint8Array}  nacl.KeyPair.secretKey
   * @param seqno {number}
   * @param dummySignature?    {boolean}
   * @return {Promise<ExternalMessage>}
   */
  async createExternalMessage(
    signingMessage: Cell,
    secretKey: Uint8Array,
    seqno: number,
    dummySignature = false
  ): Promise<ExternalMessage> {
    const signature = dummySignature
      ? new Uint8Array(64)
      : nacl.sign.detached(await signingMessage.hash(), secretKey);

    const body = new Cell();
    body.bits.writeBytes(signature);
    body.writeCell(signingMessage);

    let stateInit: Cell | null = null,
      code: Cell | Uint8Array | null = null,
      data: Cell | null = null;

    if (seqno === 0) {
      if (!this.options.publicKey) {
        const keyPair = nacl.sign.keyPair.fromSecretKey(secretKey);
        this.options.publicKey = keyPair.publicKey;
      }
      const deploy = await this.createStateInit();
      stateInit = deploy.stateInit;
      code = deploy.code;
      data = deploy.data;
    }

    const selfAddress = await this.getAddress();
    const header = Contract.createExternalMessageHeader(selfAddress);
    const resultMessage = Contract.createCommonMsgInfo(header, stateInit, body);

    return {
      address: selfAddress,
      message: resultMessage, // old wallet_send_generate_external_message

      body: body,
      signature: signature,
      signingMessage: signingMessage,

      stateInit,
      code,
      data,
    };
  }

  /**
   * @param secretKey {Uint8Array}  nacl.KeyPair.secretKey
   * @param address   {Address | string}
   * @param amount    {BN | number} in nanograms
   * @param seqno {number}
   * @param payload?   {string | Uint8Array | Cell}
   * @param sendMode?  {number}
   * @param dummySignature?    {boolean}
   * @param stateInit? {Cell}
   * @return {Promise<ExternalMessage>}
   */
  async createTransferMessage(
    secretKey: Uint8Array,
    address: Address | string,
    amount: BN | number,
    seqno: number,
    payload: string | Uint8Array | Cell = "",
    sendMode: number = 3,
    dummySignature = false,
    stateInit: Cell | null = null
  ) {
    let payloadCell = new Cell();
    if (payload) {
      if (typeof payload !== "string" && "refs" in payload) {
        // is Cell
        payloadCell = payload;
      } else if (typeof payload === "string") {
        if (payload.length > 0) {
          payloadCell.bits.writeUint(0, 32);
          payloadCell.bits.writeString(payload);
        }
      } else {
        payloadCell.bits.writeBytes(payload);
      }
    }

    const orderHeader = Contract.createInternalMessageHeader(
      new Address(address),
      new BN(amount)
    );
    const order = Contract.createCommonMsgInfo(
      orderHeader,
      stateInit,
      payloadCell
    );
    const signingMessage = this.createSigningMessage(seqno);
    signingMessage.bits.writeUint8(sendMode);
    signingMessage.refs.push(order);

    return this.createExternalMessage(
      signingMessage,
      secretKey,
      seqno,
      dummySignature
    );
  }
}
