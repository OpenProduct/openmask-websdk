/**
 * @private
 * @param addressString {string}
 * @return {{isTestOnly: boolean, workchain: number, hashPart: Uint8Array, isBounceable: boolean}}
 */
export declare function parseFriendlyAddress(addressString: string): {
    isTestOnly: boolean;
    isBounceable: boolean;
    workchain: number;
    hashPart: Uint8Array;
};
export interface HashData {
    wc: number;
    hashPart: Uint8Array;
}
export declare class Address {
    /**
     * @param anyForm {string | Address}
     */
    static isValid(anyForm: string | Address | any): anyForm is Address;
    wc: number;
    hashPart: Uint8Array;
    isTestOnly: boolean;
    isUserFriendly: boolean;
    isBounceable: boolean;
    isUrlSafe: boolean;
    /**
     * @param anyForm {string | Address}
     */
    constructor(anyForm: string | Address | HashData);
    /**
     * @param isUserFriendly? {boolean}
     * @param isUrlSafe? {boolean}
     * @param isBounceable? {boolean}
     * @param isTestOnly? {boolean}
     * @return {string}
     */
    toString(isUserFriendly?: boolean, isUrlSafe?: boolean, isBounceable?: boolean, isTestOnly?: boolean): string;
}
export default Address;
