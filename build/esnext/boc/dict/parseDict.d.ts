import { BitString } from "../bitString";
import { Slice } from "../slice";
export declare function parseDict<T>(slice: Slice, keySize: number, extractor: (slice: Slice) => T): Map<string, T>;
export declare function parseDictBitString(slice: Slice, keySize: number): Map<string, BitString>;
export declare function parseDictRefs(slice: Slice, keySize: number): Map<string, Slice>;
