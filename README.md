# TypeScript SDK for [The Open Network](https://ton.org)

Converted to typescript [TonWeb](https://github.com/toncenter/tonweb)
To be typesave OpenMask team change some methods.

## Install Web

`npm install github:TonMask/tonmask-websdk` or `yarn add github:TonMask/tonmask-websdk`

### HttpProvider

```ts
import { HttpProvider } from "@tonmask/web-sdk";

const provider = new HttpProvider(config.rpcUrl, {
  apiKey: config.apiKey,
});

// Get Wallet Balance
const amount: string = await provider.getBalance(wallet);

// Get Wallet SeqNo
const seqno: BN = await provider.call2(wallet, "seqno");
  
// Get wallet transactions
const transactions = ton.getTransactions(wallet, 10)
  
```

### Send transaction

```ts

import { ALL, hexToBytes, toNano } from "@tonmask/web-sdk";

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
import { Dns } from "@tonmask/web-sdk";

const dns = new Dns(provider, { rootDnsAddress: config.rootDnsAddress });
const address = await dns.getWalletAddress(toAddress);
if (!address) {
  throw new Error("Invalid address");
}
if (!Address.isValid(address)) {
  throw new Error("Invalid address");
}

```
