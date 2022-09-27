import BN from "bn.js";
import { base64ToBytes } from "../utils/utils";

const { Cell } = require("../boc/cell");

export type Pair =
  | ["num", string | number]
  | ["list", any]
  | ["tuple", any]
  | ["cell", any]
  | ["tvm.Slice", string]
  | ["tvm.Cell", string];

interface Result {
  exit_code: number;
  stack: Pair[];
}

class ProviderError extends Error {
  result: Result;
  constructor(message: string, result: Result) {
    super(message);
    this.result = result;
  }
}

export class HttpProviderUtils {
  static parseObject(x: any): any {
    const typeName = x["@type"];
    switch (typeName) {
      case "tvm.list":
      case "tvm.tuple":
        return x.elements.map(HttpProviderUtils.parseObject);
      case "tvm.cell":
        return Cell.oneFromBoc(base64ToBytes(x.bytes));
      case "tvm.stackEntryCell":
        return HttpProviderUtils.parseObject(x.cell);
      case "tvm.stackEntryTuple":
        return HttpProviderUtils.parseObject(x.tuple);
      case "tvm.stackEntryNumber":
        return HttpProviderUtils.parseObject(x.number);
      case "tvm.numberDecimal":
        return new BN(x.number, 10);
      default:
        throw new Error("unknown type " + typeName);
    }
  }

  /**
   * @param pair  {any[]}
   * @return {any}
   */
  static parseResponseStack(pair: Pair) {
    const typeName = pair[0];
    const value = pair[1];

    switch (typeName) {
      case "num":
        return new BN(value.replace(/0x/, ""), 16);
      case "list":
      case "tuple":
        return HttpProviderUtils.parseObject(value);
      case "cell":
        const contentBytes = base64ToBytes(value.bytes);
        return Cell.oneFromBoc(contentBytes);
      default:
        throw new Error("unknown type " + typeName);
    }
  }

  static parseResponse(result: Result) {
    if (result.exit_code !== 0) {
      const err = new ProviderError(
        `Http provider parse response error ${JSON.stringify(result)}`,
        result
      );
      throw err;
    }

    const arr = result.stack.map(HttpProviderUtils.parseResponseStack);
    return arr.length === 1 ? arr[0] : arr;
  }

  static makeArg(arg: BN | Number | any) {
    if (arg instanceof BN || arg instanceof Number) {
      return ["num", arg];
    } else {
      throw new Error("unknown arg type " + arg);
    }
  }

  static makeArgs(args: (BN | Number | any)[]) {
    return args.map(this.makeArg);
  }
}
