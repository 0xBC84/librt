import { Command } from "@oclif/core";
import { getWriter } from "@services/output";
import { getWallet } from "@services/ethers";
import { ethers } from "ethers";

export default class Balance extends Command {
  static description = "Provides balance operations.";

  static examples = [`$ wallet balance`];

  static flags = {};

  static args = [];

  async run(): Promise<void> {
    const { success, pending } = getWriter(this);
    const wallet = getWallet();

    const init = pending("contacting contract");
    init.start();

    const balance = await wallet.getBalance();
    const balanceDisplay = ethers.utils.formatUnits(balance, "ether");
    const balanceSuffix = "ETH";

    init.stop();
    success("balance:", balanceDisplay, balanceSuffix);
  }
}
