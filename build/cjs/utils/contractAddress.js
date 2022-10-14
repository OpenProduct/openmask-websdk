"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contractAddress = void 0;
const contract_1 = require("../contract/contract");
const address_1 = __importDefault(require("./address"));
const utils_1 = require("./utils");
async function contractAddress(source) {
    const stateInit = contract_1.Contract.createStateInit(source.initialCode, source.initialData);
    const stateInitHash = await stateInit.hash();
    return new address_1.default(source.workchain + ":" + (0, utils_1.bytesToHex)(stateInitHash));
}
exports.contractAddress = contractAddress;
