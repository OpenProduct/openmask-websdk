"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JettonMinterDao = void 0;
const cell_1 = require("../../../boc/cell");
const utils_1 = require("../../../utils/utils");
const utils_2 = require("../nft/utils");
class JettonMinterDao {
    provider;
    jettonMinterAddress;
    constructor(provider, jettonMinterAddress) {
        this.provider = provider;
        this.jettonMinterAddress = jettonMinterAddress;
    }
    /**
     * @return {Promise<JettonData>}
     */
    async getJettonData() {
        const result = await this.provider.call2(this.jettonMinterAddress.toString(), "get_jetton_data");
        const totalSupply = result[0];
        const isMutable = result[1].toNumber() === -1;
        const adminAddress = (0, utils_2.parseAddress)(result[2]);
        const jettonContentCell = result[3];
        let jettonContentUri = null;
        try {
            jettonContentUri = (0, utils_2.parseOffchainUriCell)(jettonContentCell);
        }
        catch (e) { }
        const jettonWalletCode = result[4];
        return {
            totalSupply,
            isMutable,
            adminAddress,
            jettonContentCell,
            jettonContentUri,
            jettonWalletCode,
        };
    }
    /**
     * params   {{ownerAddress: Address}}
     * @return {Promise<Address>}
     */
    async getJettonWalletAddress(ownerAddress) {
        const cell = new cell_1.Cell();
        cell.bits.writeAddress(ownerAddress);
        const result = await this.provider.call2(this.jettonMinterAddress.toString(), "get_wallet_address", [["tvm.Slice", (0, utils_1.bytesToBase64)(await cell.toBoc(false))]]);
        return (0, utils_2.parseAddress)(result);
    }
}
exports.JettonMinterDao = JettonMinterDao;
