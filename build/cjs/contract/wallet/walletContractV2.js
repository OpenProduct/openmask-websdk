"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletV2ContractR2 = exports.WalletV2ContractR1 = exports.WalletV2ContractBase = void 0;
const cell_1 = require("../../boc/cell");
const walletContract_1 = require("./walletContract");
class WalletV2ContractBase extends walletContract_1.WalletContract {
    /**
     * @override
     * @private
     * @param   seqno?   {number}
     * @return {Cell}
     */
    createSigningMessage(seqno) {
        seqno = seqno || 0;
        const message = new cell_1.Cell();
        message.bits.writeUint(seqno, 32);
        if (seqno === 0) {
            // message.bits.writeInt(-1, 32);// todo: dont work
            for (let i = 0; i < 32; i++) {
                message.bits.writeBit(1);
            }
        }
        else {
            const date = new Date();
            const timestamp = Math.floor(date.getTime() / 1e3);
            message.bits.writeUint(timestamp + 60, 32);
        }
        return message;
    }
}
exports.WalletV2ContractBase = WalletV2ContractBase;
class WalletV2ContractR1 extends WalletV2ContractBase {
    /**
     * @param provider    {TonHttpProvider}
     * @param options? {any}
     */
    constructor(provider, options) {
        options.code = cell_1.Cell.oneFromBoc("B5EE9C724101010100570000AAFF0020DD2082014C97BA9730ED44D0D70B1FE0A4F2608308D71820D31FD31F01F823BBF263ED44D0D31FD3FFD15131BAF2A103F901541042F910F2A2F800029320D74A96D307D402FB00E8D1A4C8CB1FCBFFC9ED54A1370BB6");
        super(provider, options);
    }
    getName() {
        return "v2R1";
    }
}
exports.WalletV2ContractR1 = WalletV2ContractR1;
class WalletV2ContractR2 extends WalletV2ContractBase {
    /**
     * @param provider    {TonHttpProvider}
     * @param options? {any}
     */
    constructor(provider, options) {
        options.code = cell_1.Cell.oneFromBoc("B5EE9C724101010100630000C2FF0020DD2082014C97BA218201339CBAB19C71B0ED44D0D31FD70BFFE304E0A4F2608308D71820D31FD31F01F823BBF263ED44D0D31FD3FFD15131BAF2A103F901541042F910F2A2F800029320D74A96D307D402FB00E8D1A4C8CB1FCBFFC9ED54044CD7A1");
        super(provider, options);
    }
    getName() {
        return "v2R2";
    }
}
exports.WalletV2ContractR2 = WalletV2ContractR2;