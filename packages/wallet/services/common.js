"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCurrency = exports.formatPercent = exports.formatFiat = void 0;
const ethers_1 = require("ethers");
const formatFiat = (value, currency = "$") => {
    return currency + (0, exports.formatCurrency)(value);
};
exports.formatFiat = formatFiat;
const formatPercent = (value) => {
    return (value * 100).toFixed(2) + "%";
};
exports.formatPercent = formatPercent;
const formatCurrency = (value) => {
    let _value = value;
    if (typeof _value === "number")
        _value = _value.toFixed(2);
    _value = ethers_1.ethers.utils.commify(_value.toString());
    return _value;
};
exports.formatCurrency = formatCurrency;
