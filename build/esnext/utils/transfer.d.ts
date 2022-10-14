export interface TransferUrl {
    address: string;
    amount?: string;
    text?: string;
}
/**
 * @param url {string}
 * @return {{address: string, amount?: string, text?: string}}
 * @throws if invalid url
 */
export declare function parseTransferUrl(url: string): TransferUrl;
/**
 * @param address   {string}
 * @param amount?    {string} in nano
 * @param text?   {string}
 * @return {string}
 */
export declare function formatTransferUrl(address: string, amount?: string, text?: string): string;
