"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupportedChainById = void 0;
const tslib_1 = require("tslib");
const chains_json_1 = tslib_1.__importDefault(require("./chains.json"));
const CHAINS = chains_json_1.default;
const PROTOCOL_SUPPORTED = new Set(["eip155"]);
const getSupportedChainById = (protocol, id) => {
    if (!PROTOCOL_SUPPORTED.has(protocol)) {
        throw new Error(`protocol \`${protocol}\` is not supported.`);
    }
    return chains_json_1.default.find(chain => id === chain.chainId);
};
exports.getSupportedChainById = getSupportedChainById;
exports.default = CHAINS;
