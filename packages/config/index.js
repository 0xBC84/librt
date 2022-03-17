"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
const tslib_1 = require("tslib");
const config_json_1 = tslib_1.__importDefault(require("./config.json"));
// @todo Config from persistent storage
// @todo Validate account.mnemonic is valid
const getConfig = () => {
    return config_json_1.default;
};
exports.getConfig = getConfig;
