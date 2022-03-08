import { Command } from "@oclif/core";
import { getWriter } from "@services/output";

const wait = (duration: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined);
    }, duration);
  });
};

export default class Balance extends Command {
  static description = "Provides balance operations.";

  static examples = [`$ wallet balance`];

  static flags = {};

  static args = [];

  async run(): Promise<void> {
    const { success, pending } = getWriter(this);

    const init = pending("contacting contract");
    init.start();

    await wait(2000);

    init.stop();
    success("balance: 0");
  }
}
