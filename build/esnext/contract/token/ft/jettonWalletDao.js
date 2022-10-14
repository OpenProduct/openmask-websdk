import { parseAddress } from "../nft/utils";
export class JettonWalletDao {
    provider;
    jettonWalletAddress;
    constructor(provider, jettonWalletAddress) {
        this.provider = provider;
        this.jettonWalletAddress = jettonWalletAddress;
    }
    async getData() {
        const result = await this.provider.call2(this.jettonWalletAddress.toString(), "get_wallet_data");
        const balance = result[0];
        const ownerAddress = parseAddress(result[1]);
        const jettonMinterAddress = parseAddress(result[2]);
        const jettonWalletCode = result[3];
        return { balance, ownerAddress, jettonMinterAddress, jettonWalletCode };
    }
}
