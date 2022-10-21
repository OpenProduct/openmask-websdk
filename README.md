# TypeScript SDK for [The Open Network](https://ton.org)

Converted to typescript [TonWeb](https://github.com/toncenter/tonweb)

## Install Web

```
npm install @openproduct/web-sdk

// or

yarn add @openproduct/web-sdk

// or

pnpm add @openproduct/web-sdk
```

### TonHttpProvider

```ts
import { TonHttpProvider } from "@openproduct/web-sdk";

const provider = new TonHttpProvider(config.rpcUrl, {
  apiKey: config.apiKey,
});

// Get Wallet Balance
const amount: string = await provider.getBalance(wallet);

// Get Wallet SeqNo
const seqno: BN = await provider.call2(wallet, "seqno");

// Get wallet transactions
const transactions = await ton.getTransactions(wallet, 10);
```

### Send transaction

```ts
import { ALL, hexToBytes, toNano } from "@openproduct/web-sdk";

const WalletClass = ALL[wallet.version];
const contract = new WalletClass(provider, {
  publicKey: hexToBytes(wallet.publicKey),
  wc: 0,
});

const params: TransferParams = {
  secretKey: keyPair.secretKey,
  toAddress,
  amount: toNano(amount),
  seqno: seqno,
  payload: comment,
  sendMode: 3,
};

const method = contract.transfer(params);

// Get estimate fee
const fees = await method.estimateFee();

// Send transaction

await method.send();
```

### TonDNS

Resolve ton DNS address:

```ts
import { TonDns } from "@openproduct/web-sdk";

const dns = new TonDns(provider, { rootDnsAddress: config.rootDnsAddress });
const address = await dns.getWalletAddress(toAddress);
if (!address) {
  throw new Error("Invalid address");
}
if (!Address.isValid(address)) {
  throw new Error("Invalid address");
}
```
