"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jettonTransferBody = exports.jettonBurnBody = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const cell_1 = require("../../../boc/cell");
const jettonBurnBody = (params) => {
    const cell = new cell_1.Cell();
    cell.bits.writeUint(0x595f07bc, 32); // burn op
    cell.bits.writeUint(params.queryId || 0, 64);
    cell.bits.writeCoins(params.jettonAmount);
    cell.bits.writeAddress(params.responseAddress);
    return cell;
};
exports.jettonBurnBody = jettonBurnBody;
const jettonTransferBody = (params) => {
    const cell = new cell_1.Cell();
    cell.bits.writeUint(0xf8a7ea5, 32); // request_transfer op
    cell.bits.writeUint(params.queryId || 0, 64);
    cell.bits.writeCoins(params.jettonAmount);
    cell.bits.writeAddress(params.toAddress);
    cell.bits.writeAddress(params.responseAddress);
    cell.bits.writeBit(false); // null custom_payload
    cell.bits.writeCoins(params.forwardAmount || new bn_js_1.default(0));
    cell.bits.writeBit(false); // forward_payload in this slice, not separate cell
    if (params.forwardPayload) {
        cell.bits.writeBytes(params.forwardPayload);
    }
    return cell;
};
exports.jettonTransferBody = jettonTransferBody;
