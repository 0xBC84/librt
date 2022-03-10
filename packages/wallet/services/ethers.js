"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWallet = void 0;
const config_1 = require("@services/config");
const ethers_1 = require("ethers");
const getWallet = () => {
    const { mneomic, node, network } = (0, config_1.getConfig)();
    const _network = network === "localhost" ? undefined : network;
    const _provider = new ethers_1.ethers.providers.JsonRpcProvider(node, _network);
    return ethers_1.ethers.Wallet.fromMnemonic(mneomic).connect(_provider);
};
exports.getWallet = getWallet;
