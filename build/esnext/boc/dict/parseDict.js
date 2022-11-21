import { BN } from "bn.js";
function doParse(prefix, slice, n, res, extractor) {
    // Reading label
    let lb0 = slice.loadBit() ? 1 : 0;
    let prefixLength = 0;
    let pp = prefix;
    if (lb0 === 0) {
        // Short label detected
        // Read
        prefixLength = slice.readUnaryLength();
        // Read prefix
        for (let i = 0; i < prefixLength; i++) {
            pp += slice.loadBit() ? "1" : "0";
        }
    }
    else {
        let lb1 = slice.loadBit() ? 1 : 0;
        if (lb1 === 0) {
            // Long label detected
            prefixLength = slice.loadUint(Math.ceil(Math.log2(n + 1))).toNumber();
            for (let i = 0; i < prefixLength; i++) {
                pp += slice.loadBit() ? "1" : "0";
            }
        }
        else {
            // Same label detected
            let bit = slice.loadBit() ? "1" : "0";
            prefixLength = slice.loadUint(Math.ceil(Math.log2(n + 1))).toNumber();
            for (let i = 0; i < prefixLength; i++) {
                pp += bit;
            }
        }
    }
    if (n - prefixLength === 0) {
        res.set(new BN(pp, 2).toString(10), extractor(slice));
    }
    else {
        let left = slice.readCell();
        let right = slice.readCell();
        // NOTE: Left and right branches are implicitly contain prefixes '0' and '1'
        if (!left.isExotic) {
            doParse(pp + "0", left.beginParse(), n - prefixLength - 1, res, extractor);
        }
        if (!right.isExotic) {
            doParse(pp + "1", right.beginParse(), n - prefixLength - 1, res, extractor);
        }
    }
}
export function parseDict(slice, keySize, extractor) {
    let res = new Map();
    doParse("", slice, keySize, res, extractor);
    return res;
}
export function parseDictBitString(slice, keySize) {
    let res = new Map();
    doParse("", slice, keySize, res, (slice) => slice.readRemaining());
    return res;
}
export function parseDictRefs(slice, keySize) {
    let res = new Map();
    doParse("", slice, keySize, res, (slice) => slice.loadRef());
    return res;
}
