"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
const getConfig = () => {
    const mneomic = process.env.LIBRT_MNEMONIC;
    const node = process.env.LIBRT_NODE;
    const network = process.env.LIBRT_NETWORK;
    if (!mneomic)
        throw new Error("`LIBRT_MNEMONIC` is not configured");
    if (!node)
        throw new Error("`LIBRT_NODE` is not configured");
    if (!network)
        throw new Error("`LIBRT_NETWORK` is not configured");
    return {
        mneomic,
        node,
        network,
    };
};
exports.getConfig = getConfig;
