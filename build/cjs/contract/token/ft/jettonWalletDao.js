"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JettonWalletDao = void 0;
const utils_1 = require("../nft/utils");
class JettonWalletDao {
    provider;
    jettonWalletAddress;
    constructor(provider, jettonWalletAddress) {
        this.provider = provider;
        this.jettonWalletAddress = jettonWalletAddress;
    }
    async getData() {
        const result = await this.provider.call2(this.jettonWalletAddress.toString(), "get_wallet_data");
        const balance = result[0];
        const ownerAddress = (0, utils_1.parseAddress)(result[1]);
        const jettonMinterAddress = (0, utils_1.parseAddress)(result[2]);
        const jettonWalletCode = result[3];
        return { balance, ownerAddress, jettonMinterAddress, jettonWalletCode };
    }
}
exports.JettonWalletDao = JettonWalletDao;
