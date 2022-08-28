import { Cell } from "../../boc/cell";
import HttpProvider from "../../providers/httpProvider";
import { Options } from "../contract";
import { WalletContract } from "./walletContract";

class WalletV3ContractBase extends WalletContract {
  /**
   * @override
   * @private
   * @param   seqno?   {number}
   * @return {Cell}
   */
  createSigningMessage(seqno?: number) {
    seqno = seqno || 0;
    const message = new Cell();
    message.bits.writeUint(this.options.walletId, 32);
    if (seqno === 0) {
      // message.bits.writeInt(-1, 32);// todo: dont work
      for (let i = 0; i < 32; i++) {
        message.bits.writeBit(1);
      }
    } else {
      const date = new Date();
      const timestamp = Math.floor(date.getTime() / 1e3);
      message.bits.writeUint(timestamp + 60, 32);
    }
    message.bits.writeUint(seqno, 32);
    return message;
  }

  /**
   * @override
   * @return {Cell} cell contains wallet data
   */
  createDataCell() {
    const cell = new Cell();
    cell.bits.writeUint(0, 32);
    cell.bits.writeUint(this.options.walletId, 32);
    cell.bits.writeBytes(this.options.publicKey);
    return cell;
  }
}

export class WalletV3ContractR1 extends WalletV3ContractBase {
  /**
   * @param provider    {HttpProvider}
   * @param options {any}
   */
  constructor(provider: HttpProvider, options: Options) {
    options.code = Cell.oneFromBoc(
      "B5EE9C724101010100620000C0FF0020DD2082014C97BA9730ED44D0D70B1FE0A4F2608308D71820D31FD31FD31FF82313BBF263ED44D0D31FD31FD3FFD15132BAF2A15144BAF2A204F901541055F910F2A3F8009320D74A96D307D402FB00E8D101A4C8CB1FCB1FCBFFC9ED543FBE6EE0"
    );
    super(provider, options);
    if (!this.options.walletId)
      this.options.walletId = 698983191 + this.options.wc!;
  }

  getName() {
    return "v3R1";
  }
}

export class WalletV3ContractR2 extends WalletV3ContractBase {
  /**
   * @param provider    {HttpProvider}
   * @param options {any}
   */
  constructor(provider: HttpProvider, options: Options) {
    options.code = Cell.oneFromBoc(
      "B5EE9C724101010100710000DEFF0020DD2082014C97BA218201339CBAB19F71B0ED44D0D31FD31F31D70BFFE304E0A4F2608308D71820D31FD31FD31FF82313BBF263ED44D0D31FD31FD3FFD15132BAF2A15144BAF2A204F901541055F910F2A3F8009320D74A96D307D402FB00E8D101A4C8CB1FCB1FCBFFC9ED5410BD6DAD"
    );
    super(provider, options);
    if (!this.options.walletId)
      this.options.walletId = 698983191 + this.options.wc!;
  }

  getName() {
    return "v3R2";
  }
}
