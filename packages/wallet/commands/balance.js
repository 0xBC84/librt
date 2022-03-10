"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const output_1 = require("@services/output");
const ethers_1 = require("@services/ethers");
const ethers_2 = require("ethers");
class Balance extends core_1.Command {
    static description = "Provides balance operations.";
    static examples = [`$ wallet balance`];
    static flags = {};
    static args = [];
    async run() {
        const { success, pending } = (0, output_1.getWriter)(this);
        const wallet = (0, ethers_1.getWallet)();
        const init = pending("contacting contract");
        init.start();
        const balance = await wallet.getBalance();
        const balanceDisplay = ethers_2.ethers.utils.formatUnits(balance, "ether");
        const balanceSuffix = "ETH";
        init.stop();
        success("balance:", balanceDisplay, balanceSuffix);
    }
}
exports.default = Balance;
