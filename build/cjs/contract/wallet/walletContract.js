"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletContract = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const cell_1 = require("../../boc/cell");
const address_1 = __importDefault(require("../../utils/address"));
const contract_1 = require("../contract");
/**
 * Abstract standard wallet class
 */
class WalletContract extends contract_1.Contract {
    deploy;
    constructor(provider, options) {
        if (!options.publicKey && !options.address)
            throw new Error("WalletContract required publicKey or address in options");
        super(provider, options);
        /**
         * @param secretKey {Uint8Array}
         */
        this.deploy = (secretKey) => contract_1.Contract.createMethod(provider, this.createInitExternalMessage(secretKey));
    }
    transfer = (params) => contract_1.Contract.createMethod(this.provider, this.createTransferMessage(params.secretKey, params.toAddress, params.amount, params.seqno, params.payload, params.sendMode, !Boolean(params.secretKey), params.stateInit));
    seqno = () => {
        return {
            call: async () => {
                const address = await this.getAddress();
                let n = null;
                try {
                    n = this.provider.getSeqno(address.toString());
                }
                catch (e) { }
                return n;
            },
        };
    };
    getName() {
        throw new Error("override me");
    }
    /**
     * @override
     * @protected
     * @return {Cell} cell contains wallet data
     */
    createDataCell() {
        // 4 byte seqno, 32 byte publicKey
        const cell = new cell_1.Cell();
        cell.bits.writeUint(0, 32); // seqno
        cell.bits.writeBytes(this.options.publicKey);
        return cell;
    }
    /**
     * @protected
     * @param   seqno?   {number}
     * @return {Cell}
     */
    createSigningMessage(seqno) {
        seqno = seqno || 0;
        const cell = new cell_1.Cell();
        cell.bits.writeUint(seqno, 32);
        return cell;
    }
    /**
     * External message for initialization
     * @param secretKey  {Uint8Array} nacl.KeyPair.secretKey
     * @return {{address: Address, message: Cell, body: Cell, sateInit: Cell, code: Cell, data: Cell}}
     */
    async createInitExternalMessage(secretKey) {
        if (!this.options.publicKey) {
            const keyPair = tweetnacl_1.default.sign.keyPair.fromSecretKey(secretKey);
            this.options.publicKey = keyPair.publicKey;
        }
        const { stateInit, address, code, data } = await this.createStateInit();
        const signingMessage = this.createSigningMessage();
        const signature = tweetnacl_1.default.sign.detached(await signingMessage.hash(), secretKey);
        const body = new cell_1.Cell();
        body.bits.writeBytes(signature);
        body.writeCell(signingMessage);
        const header = contract_1.Contract.createExternalMessageHeader(address);
        const externalMessage = contract_1.Contract.createCommonMsgInfo(header, stateInit, body);
        return {
            address: address,
            message: externalMessage,
            body,
            signingMessage,
            stateInit,
            code,
            data,
        };
    }
    /**
     * @protected
     * @param signingMessage {Cell}
     * @param secretKey {Uint8Array}  nacl.KeyPair.secretKey
     * @param seqno {number}
     * @param dummySignature?    {boolean}
     * @return {Promise<ExternalMessage>}
     */
    async createExternalMessage(signingMessage, secretKey, seqno, dummySignature = false) {
        const signature = dummySignature
            ? new Uint8Array(64)
            : tweetnacl_1.default.sign.detached(await signingMessage.hash(), secretKey);
        const body = new cell_1.Cell();
        body.bits.writeBytes(signature);
        body.writeCell(signingMessage);
        let stateInit = null, code = null, data = null;
        if (seqno === 0) {
            if (!this.options.publicKey) {
                const keyPair = tweetnacl_1.default.sign.keyPair.fromSecretKey(secretKey);
                this.options.publicKey = keyPair.publicKey;
            }
            const deploy = await this.createStateInit();
            stateInit = deploy.stateInit;
            code = deploy.code;
            data = deploy.data;
        }
        const selfAddress = await this.getAddress();
        const header = contract_1.Contract.createExternalMessageHeader(selfAddress);
        const resultMessage = contract_1.Contract.createCommonMsgInfo(header, stateInit, body);
        return {
            address: selfAddress,
            message: resultMessage,
            body: body,
            signature: signature,
            signingMessage: signingMessage,
            stateInit,
            code,
            data,
        };
    }
    /**
     * @param secretKey {Uint8Array}  nacl.KeyPair.secretKey
     * @param address   {Address | string}
     * @param amount    {BN | number} in nanograms
     * @param seqno {number}
     * @param payload?   {string | Uint8Array | Cell}
     * @param sendMode?  {number}
     * @param dummySignature?    {boolean}
     * @param stateInit? {Cell}
     * @return {Promise<ExternalMessage>}
     */
    async createTransferMessage(secretKey, address, amount, seqno, payload = "", sendMode = 3, dummySignature = false, stateInit = null) {
        let payloadCell = new cell_1.Cell();
        if (payload) {
            if (typeof payload !== "string" && "refs" in payload) {
                // is Cell
                payloadCell = payload;
            }
            else if (typeof payload === "string") {
                if (payload.length > 0) {
                    payloadCell.bits.writeUint(0, 32);
                    payloadCell.bits.writeString(payload);
                }
            }
            else {
                payloadCell.bits.writeBytes(payload);
            }
        }
        const orderHeader = contract_1.Contract.createInternalMessageHeader(new address_1.default(address), new bn_js_1.default(amount));
        const order = contract_1.Contract.createCommonMsgInfo(orderHeader, stateInit, payloadCell);
        const signingMessage = this.createSigningMessage(seqno);
        signingMessage.bits.writeUint8(sendMode);
        signingMessage.refs.push(order);
        return this.createExternalMessage(signingMessage, secretKey, seqno, dummySignature);
    }
}
exports.WalletContract = WalletContract;
