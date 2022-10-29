export function moveToTheEnd(indexHashmap: any, topologicalOrderArray: any, target: any): Promise<void>;
/**
 * @param cell  {Cell}
 * @param topologicalOrderArray array of pairs: cellHash: Uint8Array, cell: Cell, ...
 * @param indexHashmap cellHash: Uint8Array -> cellIndex: number
 * @return {[[], {}]} topologicalOrderArray and indexHashmap
 */
export function treeWalk(cell: Cell, topologicalOrderArray: any, indexHashmap: any, parentHash?: null): [[], {}];
export function parseBocHeader(serializedBoc: any): {
    has_idx: number | undefined;
    hash_crc32: number | undefined;
    has_cache_bits: number | undefined;
    flags: number | undefined;
    size_bytes: any;
    off_bytes: any;
    cells_num: number;
    roots_num: number;
    absent_num: number;
    tot_cells_size: number;
    root_list: number[];
    index: boolean;
    cells_data: any;
};
export function deserializeCellData(cellData: any, referenceIndexSize: any): {
    cell: Cell;
    residue: any;
};
/**
 * @param serializedBoc  {string | Uint8Array} hex or bytearray
 * @return {Cell[]} root cells
 */
export function deserializeBoc(serializedBoc: string | Uint8Array): Cell[];
export class Cell {
    /**
     * @param serializedBoc  {string | Uint8Array} hex or bytearray
     * @return {Cell[]} root cells
     */
    static fromBoc(serializedBoc: string | Uint8Array): Cell[];
    /**
     * @param serializedBoc  {string | Uint8Array} hex or bytearray
     * @return {Cell} root cell
     */
    static oneFromBoc(serializedBoc: string | Uint8Array): Cell;
    bits: BitString;
    refs: any[];
    isExotic: boolean;
    /**
     * Write another cell to this cell
     * @param anotherCell  {Cell}
     */
    writeCell(anotherCell: Cell): void;
    /**
     * @return {number}
     */
    getMaxLevel(): number;
    /**
     * @return {number}
     */
    isExplicitlyStoredHashes(): number;
    /**
     * @return {number}
     */
    getMaxDepth(): number;
    /**
     * @private
     * @return {Uint8Array}
     */
    private getMaxDepthAsArray;
    /**
     * @return {Uint8Array}
     */
    getRefsDescriptor(): Uint8Array;
    /**
     * @return {Uint8Array}
     */
    getBitsDescriptor(): Uint8Array;
    /**
     * @return {Uint8Array}
     */
    getDataWithDescriptors(): Uint8Array;
    /**
     * @return {Uint8Array}
     */
    getRepr(): Uint8Array;
    /**
     * @return {Uint8Array}
     */
    hash(): Uint8Array;
    /**
     * Recursively prints cell's content like Fift
     * @return  {string}
     */
    print(indent: any): string;
    /**
     * create boc bytearray
     * @param has_idx? {boolean}
     * @param hash_crc32?  {boolean}
     * @param has_cache_bits?  {boolean}
     * @param flags? {number}
     * @return {Promise<Uint8Array>}
     */
    toBoc(has_idx?: boolean, hash_crc32?: boolean, has_cache_bits?: boolean, flags?: number): Promise<Uint8Array>;
    toHex(has_idx?: boolean, hash_crc32?: boolean, has_cache_bits?: boolean, flags?: number): Promise<string>;
    /**
     * @private
     * @param cellsIndex
     * @param refSize
     * @return {Promise<Uint8Array>}
     */
    private serializeForBoc;
    /**
     * @private
     * @param cellsIndex
     * @param refSize
     * @return {Promise<number>}
     */
    private bocSerializationSize;
    /**
     * @private
     * @return {[[], {}]} topologicalOrderArray and indexHashmap
     */
    private treeWalk;
}
import { BitString } from "./bitString";
