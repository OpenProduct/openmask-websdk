import { Cell } from "../boc/cell";

export interface Message {
  writeTo(cell: Cell): void;
}
