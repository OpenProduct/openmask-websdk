"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTransferUrl = exports.parseTransferUrl = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const address_1 = __importDefault(require("./address"));
/**
 * @param url {string}
 * @return {{address: string, amount?: string, text?: string}}
 * @throws if invalid url
 */
function parseTransferUrl(url) {
    const PREFIX = "ton://transfer/";
    if (!url.startsWith(PREFIX)) {
        throw new Error("must starts with " + PREFIX);
    }
    const arr = url.substring(PREFIX.length).split("?");
    if (arr.length > 2) {
        throw new Error('multiple "?"');
    }
    const address = arr[0];
    if (!address_1.default.isValid(address)) {
        throw new Error("invalid address format " + address);
    }
    const result = {
        address: address,
    };
    const rest = arr[1];
    if (rest && rest.length) {
        const pairs = rest.split("&").map((s) => s.split("="));
        for (const pair of pairs) {
            if (pair.length !== 2)
                throw new Error("invalid url pair");
            const key = pair[0];
            const value = pair[1];
            if (key === "amount") {
                if (result.amount) {
                    throw new Error("amount already set");
                }
                const bn = new bn_js_1.default(value);
                if (bn.isNeg()) {
                    throw new Error("negative amount");
                }
                result.amount = value;
            }
            else if (key === "text") {
                if (result.text) {
                    throw new Error("text already set");
                }
                result.text = decodeURIComponent(value);
            }
            else {
                throw new Error("unknown url var " + key);
            }
        }
    }
    return result;
}
exports.parseTransferUrl = parseTransferUrl;
/**
 * @param address   {string}
 * @param amount?    {string} in nano
 * @param text?   {string}
 * @return {string}
 */
function formatTransferUrl(address, amount, text) {
    let url = "ton://transfer/" + address;
    const params = [];
    if (amount) {
        params.push("amount=" + amount);
    }
    if (text) {
        params.push("text=" + encodeURIComponent(text));
    }
    if (params.length === 0)
        return url;
    return url + "?" + params.join("&");
}
exports.formatTransferUrl = formatTransferUrl;
