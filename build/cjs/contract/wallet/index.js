"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultVersion = exports.LIST = exports.ALL = exports.WalletV4ContractR2 = exports.WalletV4ContractR1 = exports.WalletV3ContractR2 = exports.WalletV3ContractR1 = exports.WalletV2ContractR2 = exports.WalletV2ContractR1 = void 0;
const walletContractV2_1 = require("./walletContractV2");
Object.defineProperty(exports, "WalletV2ContractR1", { enumerable: true, get: function () { return walletContractV2_1.WalletV2ContractR1; } });
Object.defineProperty(exports, "WalletV2ContractR2", { enumerable: true, get: function () { return walletContractV2_1.WalletV2ContractR2; } });
const walletContractV3_1 = require("./walletContractV3");
Object.defineProperty(exports, "WalletV3ContractR1", { enumerable: true, get: function () { return walletContractV3_1.WalletV3ContractR1; } });
Object.defineProperty(exports, "WalletV3ContractR2", { enumerable: true, get: function () { return walletContractV3_1.WalletV3ContractR2; } });
const walletContractV4_1 = require("./walletContractV4");
Object.defineProperty(exports, "WalletV4ContractR1", { enumerable: true, get: function () { return walletContractV4_1.WalletV4ContractR1; } });
const walletContractV4R2_1 = require("./walletContractV4R2");
Object.defineProperty(exports, "WalletV4ContractR2", { enumerable: true, get: function () { return walletContractV4R2_1.WalletV4ContractR2; } });
__exportStar(require("./walletContract"), exports);
exports.ALL = {
    v2R1: walletContractV2_1.WalletV2ContractR1,
    v2R2: walletContractV2_1.WalletV2ContractR2,
    v3R1: walletContractV3_1.WalletV3ContractR1,
    v3R2: walletContractV3_1.WalletV3ContractR2,
    v4R1: walletContractV4_1.WalletV4ContractR1,
    v4R2: walletContractV4R2_1.WalletV4ContractR2,
};
exports.LIST = [
    walletContractV2_1.WalletV2ContractR1,
    walletContractV2_1.WalletV2ContractR2,
    walletContractV3_1.WalletV3ContractR1,
    walletContractV3_1.WalletV3ContractR2,
    walletContractV4_1.WalletV4ContractR1,
    walletContractV4R2_1.WalletV4ContractR2,
];
exports.defaultVersion = "v3R1";
