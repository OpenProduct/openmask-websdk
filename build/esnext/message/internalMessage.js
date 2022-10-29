import BN from "bn.js";
export class InternalMessage {
    from;
    to;
    value;
    ihrDisabled;
    bounce;
    bounced;
    ihrFees;
    fwdFees;
    createdAt;
    createdLt;
    body;
    constructor(opts) {
        this.to = opts.to;
        this.value = new BN(opts.value);
        this.bounce = opts.bounce;
        this.body = opts.body;
        if (opts.from) {
            this.from = opts.from;
        }
        else {
            this.from = null;
        }
        if (opts.ihrDisabled !== null && opts.ihrDisabled !== undefined) {
            this.ihrDisabled = opts.ihrDisabled;
        }
        else {
            this.ihrDisabled = true;
        }
        if (opts.bounced !== null && opts.bounced !== undefined) {
            this.bounced = opts.bounced;
        }
        else {
            this.bounced = false;
        }
        if (opts.ihrFees !== null && opts.ihrFees !== undefined) {
            this.ihrFees = new BN(opts.ihrFees);
        }
        else {
            this.ihrFees = new BN(0);
        }
        if (opts.fwdFees !== null && opts.fwdFees !== undefined) {
            this.fwdFees = new BN(opts.fwdFees);
        }
        else {
            this.fwdFees = new BN(0);
        }
        if (opts.createdAt !== null && opts.createdAt !== undefined) {
            this.createdAt = new BN(opts.createdAt);
        }
        else {
            this.createdAt = new BN(0);
        }
        if (opts.createdLt !== null && opts.createdLt !== undefined) {
            this.createdLt = new BN(opts.createdLt);
        }
        else {
            this.createdLt = new BN(0);
        }
    }
    writeTo(cell) {
        cell.bits.writeBit(0); // Message id
        cell.bits.writeBit(this.ihrDisabled);
        cell.bits.writeBit(this.bounce);
        cell.bits.writeBit(this.bounced);
        cell.bits.writeAddress(this.from);
        cell.bits.writeAddress(this.to);
        cell.bits.writeCoins(this.value);
        cell.bits.writeBit(false); // Currency collection (not supported)
        cell.bits.writeCoins(this.ihrFees);
        cell.bits.writeCoins(this.fwdFees);
        cell.bits.writeUint(this.createdLt, 64);
        cell.bits.writeUint(this.createdAt, 32);
        this.body.writeTo(cell);
    }
}
