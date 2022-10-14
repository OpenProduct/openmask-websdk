import BN from "bn.js";
export declare type Pair = ["num", string | number] | ["list", any] | ["tuple", any] | ["cell", any] | ["tvm.Slice", string] | ["tvm.Cell", string];
interface Result {
    exit_code: number;
    stack: Pair[];
}
export declare class TonHttpProviderUtils {
    static parseObject(x: any): any;
    /**
     * @param pair  {any[]}
     * @return {any}
     */
    static parseResponseStack(pair: Pair): any;
    static parseResponse(result: Result): any;
    static makeArg(arg: BN | Number | any): (string | Number | BN)[];
    static makeArgs(args: (BN | Number | any)[]): (string | Number | BN)[][];
}
export {};
