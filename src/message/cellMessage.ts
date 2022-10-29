import { Cell } from "../boc/cell";
import { Message } from "./message";

export class CellMessage implements Message {
  private cell: Cell;

  constructor(cell: Cell) {
    this.cell = cell;
  }

  writeTo(cell: Cell) {
    cell.writeCell(this.cell);
  }
}
