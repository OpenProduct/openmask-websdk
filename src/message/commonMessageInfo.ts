import { Cell } from "../boc/cell";
import { Message } from "./message";

export class CommonMessageInfo implements Message {
  readonly stateInit: Message | null;
  readonly body: Message | null;

  constructor(opts?: { stateInit?: Message; body?: Message }) {
    if (opts && opts.stateInit !== null && opts.stateInit !== undefined) {
      this.stateInit = opts.stateInit;
    } else {
      this.stateInit = null;
    }
    if (opts && opts.body !== null && opts.body !== undefined) {
      this.body = opts.body;
    } else {
      this.body = null;
    }
  }

  writeTo(cell: Cell) {
    // Write state
    if (this.stateInit) {
      cell.bits.writeBit(1);
      const stateInitCell = new Cell();
      this.stateInit.writeTo(stateInitCell);

      //-1:  need at least one bit for body
      if (
        cell.bits.getFreeBits() - 1 /* At least on byte for body */ >=
        stateInitCell.bits.cursor
      ) {
        cell.bits.writeBit(0);
        cell.writeCell(stateInitCell);
      } else {
        cell.bits.writeBit(1);
        cell.refs.push(stateInitCell);
      }
    } else {
      cell.bits.writeBit(0);
    }

    // Write body
    if (this.body) {
      const bodyCell = new Cell();
      this.body.writeTo(bodyCell);
      if (cell.bits.getFreeBits() >= bodyCell.bits.cursor) {
        cell.bits.writeBit(0);
        cell.writeCell(bodyCell);
      } else {
        cell.bits.writeBit(1);
        cell.refs.push(bodyCell);
      }
    } else {
      cell.bits.writeBit(0);
    }
  }
}
