"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.beginCell = exports.Builder = void 0;
const bitString_1 = require("./bitString");
const cell_1 = require("./cell");
class Builder {
    bits = bitString_1.BitString.alloc(1023);
    refs = [];
    ended = false;
    storeRef = (src) => {
        if (this.ended) {
            throw Error("Already ended");
        }
        this.refs.push(src);
        return this;
    };
    storeBit = (value) => {
        if (this.ended) {
            throw Error("Already ended");
        }
        this.bits.writeBit(value);
        return this;
    };
    storeBitArray = (value) => {
        if (this.ended) {
            throw Error("Already ended");
        }
        this.bits.writeBitArray(value);
        return this;
    };
    storeUint = (value, bitLength) => {
        if (this.ended) {
            throw Error("Already ended");
        }
        this.bits.writeUint(value, bitLength);
        return this;
    };
    storeInt = (value, bitLength) => {
        if (this.ended) {
            throw Error("Already ended");
        }
        this.bits.writeInt(value, bitLength);
        return this;
    };
    storeUint8 = (value) => {
        if (this.ended) {
            throw Error("Already ended");
        }
        this.bits.writeUint8(value);
        return this;
    };
    storeVarUint = (value, bitLength) => {
        if (this.ended) {
            throw Error("Already ended");
        }
        this.bits.writeVarUInt(value, bitLength);
        return this;
    };
    storeBuffer = (buffer) => {
        if (this.ended) {
            throw Error("Already ended");
        }
        this.bits.writeBuffer(buffer);
        return this;
    };
    storeCoins = (amount) => {
        if (this.ended) {
            throw Error("Already ended");
        }
        this.bits.writeCoins(amount);
        return this;
    };
    storeAddress = (address) => {
        if (this.ended) {
            throw Error("Already ended");
        }
        this.bits.writeAddress(address);
        return this;
    };
    storeBitString = (value) => {
        if (this.ended) {
            throw Error("Already ended");
        }
        this.bits.writeBitString(value);
        return this;
    };
    storeDict = (src) => {
        if (this.ended) {
            throw Error("Already ended");
        }
        if (src) {
            this.bits.writeBit(true);
            this.refs.push(src);
        }
        else {
            this.bits.writeBit(false);
        }
        return this;
    };
    storeRefMaybe = (src) => {
        return this.storeDict(src);
    };
    storeCellCopy = (src) => {
        this.storeBitString(src.bits);
        for (let r of src.refs) {
            this.storeRef(r);
        }
        return this;
    };
    endCell() {
        if (this.ended) {
            throw Error("Already ended");
        }
        this.ended = true;
        let res = new cell_1.Cell();
        res.bits = this.bits;
        res.isExotic = false;
        for (let r of this.refs) {
            res.refs.push(r);
        }
        return res;
    }
}
exports.Builder = Builder;
function beginCell() {
    return new Builder();
}
exports.beginCell = beginCell;
