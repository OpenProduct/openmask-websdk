"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CellMessage = void 0;
class CellMessage {
    cell;
    constructor(cell) {
        this.cell = cell;
    }
    writeTo(cell) {
        cell.writeCell(this.cell);
    }
}
exports.CellMessage = CellMessage;