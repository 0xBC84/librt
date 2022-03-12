import { CliUx, Command, Flags } from "@oclif/core";
import chalk from "chalk";

export default class AccountList extends Command {
  static description = "";

  static examples = [`$ wallet account:list`];

  static flags = {};

  static args = [];

  async run(): Promise<void> {
    const info = chalk.reset.grey("[INFO]");
    const active = chalk.reset.grey("[ACTIVE]");

    CliUx.ux.action.start(chalk(info, "fetching accounts"));
    await CliUx.ux.wait(2000);
    CliUx.ux.action.stop();

    const data = [
      { name: "Spending:", balance: "0.00000 ETH", active },
      { name: "Saving:", balance: "0.00000 ETH", active: "" },
      { name: "Expenses:", balance: "0.00000 ETH", active: "" },
    ];

    const columns = {
      name: {
        minWidth: 15,
      },
      balance: {},
      active: {},
    };

    const options = {
      "no-header": true,
    };

    this.log("");
    CliUx.ux.table(data, columns, options);
    this.log("");
  }
}
