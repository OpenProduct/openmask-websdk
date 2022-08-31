import BN from "bn.js";
import { HttpProviderUtils, Pair } from "./httpProviderUtils";

const SHARD_ID_ALL = "-9223372036854775808"; // 0x8000000000000000

export interface EstimateFee {
  source_fees: {
    in_fwd_fee: number;
    storage_fee: number;
    gas_fee: number;
    fwd_fee: number;
  };
}

interface JRPSRequest {
  id: number;
  jsonrpc: string;
  method: string;
  params: any;
}

export class HttpProvider {
  SHARD_ID_ALL = SHARD_ID_ALL;

  host: string;
  options: { apiKey?: string };
  /**
   * @param host? {string}
   * @param options? {{apiKey: string}}
   */
  constructor(host: string, options?: { apiKey?: string }) {
    this.host = host || "https://toncenter.com/api/v2/jsonRPC";
    this.options = options || {};
  }

  /**
   * @private
   * @param apiUrl   {string}
   * @param request   {any}
   * @return {Promise<any>}
   */
  async sendImpl(apiUrl: string, request: JRPSRequest) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (this.options.apiKey) {
      headers["X-API-Key"] = this.options.apiKey;
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(request),
    });
    if (response.status !== 200) {
      const methodName =
        request.method === "runGetMethod"
          ? `runGetMethod: ${request.params.method}`
          : request.method;
      throw new Error(
        `${response.status}: ${methodName}: ${response.statusText}`
      );
    }
    const { result, error } = await response.json();
    return result || Promise.reject(error);
  }

  /**
   * @param method    {string}
   * @param params    {any}  todo: Array<any>
   * @return {Promise<any>}
   */
  send<Payload>(method: string, params: Payload) {
    return this.sendImpl(this.host, {
      id: 1,
      jsonrpc: "2.0",
      method: method,
      params: params,
    });
  }

  /**
   * Use this method to get information about address: balance, code, data, last_transaction_id.
   * @param address {string}
   */
  async getAddressInfo(address: string) {
    return this.send("getAddressInformation", { address: address });
  }

  /**
   * Similar to previous one but tries to parse additional information for known contract types. This method is based on generic.getAccountState thus number of recognizable contracts may grow. For wallets we recommend to use getWalletInformation.
   * @param address {string}
   */
  async getExtendedAddressInfo(address: string) {
    return this.send("getExtendedAddressInformation", { address: address });
  }

  /**
   * Use this method to retrieve wallet information, this method parse contract state and currently supports more wallet types than getExtendedAddressInformation: simple wallet, stadart wallet and v3 wallet.
   * @param address {string}
   */
  async getWalletInfo(address: string) {
    return this.send("getWalletInformation", { address: address });
  }

  /**
   * Use this method to get transaction history of a given address.
   * @param address   {string}
   * @param limit?    {number}
   * @param lt?    {number}
   * @param hash?    {string}
   * @param to_lt?    {number}
   * @return array of transaction object
   */
  async getTransactions(
    address: string,
    limit: number | undefined = 20,
    lt: number | undefined = undefined,
    hash: string | undefined = undefined,
    to_lt: number | undefined = undefined,
    archival = undefined
  ) {
    return this.send("getTransactions", {
      address,
      limit,
      lt,
      hash,
      to_lt,
      archival,
    });
  }

  /**
   * Use this method to get balance (in nanograms) of a given address.
   * @param address {string}
   */
  async getBalance(address: string) {
    return this.send("getAddressBalance", { address: address });
  }

  /**
   * Use this method to get seqno of a given address.
   * @param address {string}
   */
  async getSeqno(address: string): Promise<number> {
    try {
      const seqno: BN = await this.call2(address, "seqno");
      return seqno.toNumber();
    } catch (e) {
      return 0;
    }
  }

  /**
   * Use this method to send serialized boc file: fully packed and serialized external message.
   * @param base64 {string} base64 of boc bytes Cell.toBoc
   */
  async sendBoc(base64: string) {
    return this.send("sendBoc", { boc: base64 });
  }

  /**
   * @deprecated
   * Send external message
   * @param query     object as described https://toncenter.com/api/test/v2/#sendQuerySimple
   */
  async sendQuery<Payload>(query: Payload) {
    return this.send("sendQuerySimple", query);
  }

  /**
   * @param query     object as described https://toncenter.com/api/test/v2/#estimateFee
   * @return fees object
   */
  async getEstimateFee<Payload>(query: Payload): Promise<EstimateFee> {
    return this.send("estimateFee", query);
  }

  /**
   * Invoke get-method of smart contract
   * todo: think about throw error if result.exit_code !== 0 (the change breaks backward compatibility)
   * @param address   {string}    contract address
   * @param method   {string | number}        method name or method id
   * @param params?   Array of stack elements: [['num',3], ['cell', cell_object], ['slice', slice_object]]
   */
  async call(address: string, method: string, params: Pair[] = []) {
    return this.send("runGetMethod", {
      address: address,
      method: method,
      stack: params,
    });
  }

  /**
   * Invoke get-method of smart contract
   * @param address   {string}    contract address
   * @param method   {string | number}        method name or method id
   * @param params?   Array of stack elements: [['num',3], ['cell', cell_object], ['slice', slice_object]]
   */
  async call2(address: string, method: string, params: Pair[] = []) {
    const result = await this.send("runGetMethod", {
      address: address,
      method: method,
      stack: params,
    });
    return HttpProviderUtils.parseResponse(result);
  }

  /**
   * Returns ID's of last and init block of masterchain
   */
  async getMasterchainInfo() {
    return this.send("getMasterchainInfo", {});
  }

  /**
   * Returns ID's of shardchain blocks included in this masterchain block
   * @param masterchainBlockNumber {number}
   */
  async getBlockShards(masterchainBlockNumber: number) {
    return this.send("shards", {
      seqno: masterchainBlockNumber,
    });
  }

  /**
   * Returns transactions hashes included in this block
   * @param workchain {number}
   * @param shardId   {string}
   * @param shardBlockNumber  {number}
   */
  async getBlockTransactions(
    workchain: number,
    shardId: string,
    shardBlockNumber: number
  ) {
    return this.send("getBlockTransactions", {
      workchain: workchain,
      shard: shardId,
      seqno: shardBlockNumber,
    });
  }

  /**
   * Returns transactions hashes included in this masterhcain block
   * @param masterchainBlockNumber  {number}
   */
  async getMasterchainBlockTransactions(masterchainBlockNumber: number) {
    return this.getBlockTransactions(-1, SHARD_ID_ALL, masterchainBlockNumber);
  }

  /**
   * Returns block header and his previous blocks ID's
   * @param workchain {number}
   * @param shardId   {string}
   * @param shardBlockNumber  {number}
   */
  async getBlockHeader(
    workchain: number,
    shardId: string,
    shardBlockNumber: number
  ) {
    return this.send("getBlockHeader", {
      workchain: workchain,
      shard: shardId,
      seqno: shardBlockNumber,
    });
  }

  /**
   * Returns masterchain block header and his previous block ID
   * @param masterchainBlockNumber  {number}
   */
  async getMasterchainBlockHeader(masterchainBlockNumber: number) {
    return this.getBlockHeader(-1, SHARD_ID_ALL, masterchainBlockNumber);
  }
}

export default HttpProvider;
