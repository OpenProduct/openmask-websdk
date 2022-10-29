"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonMessageInfo = void 0;
const cell_1 = require("../boc/cell");
class CommonMessageInfo {
    stateInit;
    body;
    constructor(opts) {
        if (opts && opts.stateInit !== null && opts.stateInit !== undefined) {
            this.stateInit = opts.stateInit;
        }
        else {
            this.stateInit = null;
        }
        if (opts && opts.body !== null && opts.body !== undefined) {
            this.body = opts.body;
        }
        else {
            this.body = null;
        }
    }
    writeTo(cell) {
        // Write state
        if (this.stateInit) {
            cell.bits.writeBit(1);
            const stateInitCell = new cell_1.Cell();
            this.stateInit.writeTo(stateInitCell);
            //-1:  need at least one bit for body
            if (cell.bits.getFreeBits() - 1 /* At least on byte for body */ >=
                stateInitCell.bits.getUsedBits()) {
                cell.bits.writeBit(0);
                cell.writeCell(stateInitCell);
            }
            else {
                cell.bits.writeBit(1);
                cell.refs.push(stateInitCell);
            }
        }
        else {
            cell.bits.writeBit(0);
        }
        // Write body
        if (this.body) {
            const bodyCell = new cell_1.Cell();
            this.body.writeTo(bodyCell);
            if (cell.bits.getFreeBits() >= bodyCell.bits.getUsedBits()) {
                cell.bits.writeBit(0);
                cell.writeCell(bodyCell);
            }
            else {
                cell.bits.writeBit(1);
                cell.refs.push(bodyCell);
            }
        }
        else {
            cell.bits.writeBit(0);
        }
    }
}
exports.CommonMessageInfo = CommonMessageInfo;
