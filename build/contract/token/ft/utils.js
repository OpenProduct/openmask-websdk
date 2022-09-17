import BN from "bn.js";
import { Cell } from "../../../boc/cell";
export const jettonBurnBody = (params) => {
    const cell = new Cell();
    cell.bits.writeUint(0x595f07bc, 32); // burn op
    cell.bits.writeUint(params.queryId || 0, 64);
    cell.bits.writeCoins(params.jettonAmount);
    cell.bits.writeAddress(params.responseAddress);
    return cell;
};
export const jettonTransferBody = (params) => {
    const cell = new Cell();
    cell.bits.writeUint(0xf8a7ea5, 32); // request_transfer op
    cell.bits.writeUint(params.queryId || 0, 64);
    cell.bits.writeCoins(params.jettonAmount);
    cell.bits.writeAddress(params.toAddress);
    cell.bits.writeAddress(params.responseAddress);
    cell.bits.writeBit(false); // null custom_payload
    cell.bits.writeCoins(params.forwardAmount || new BN(0));
    cell.bits.writeBit(false); // forward_payload in this slice, not separate cell
    if (params.forwardPayload) {
        cell.bits.writeBytes(params.forwardPayload);
    }
    return cell;
};
