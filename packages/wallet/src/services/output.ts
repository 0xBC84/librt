import chalk from "chalk";
import { Command } from "@oclif/core";
import { cli } from "cli-ux";

export const getWriter = (command: Command) => {
  return {
    pending: (...args: string[]) => {
      const message = chalk(pending(), ...args);
      return {
        start: () => cli.action.start(message),
        stop: () => cli.action.stop(),
      };
    },
    success: (...args: string[]) => {
      return command.log(chalk(success(), ...args));
    },
    error: (...args: string[]) => {
      return command.log(chalk(error(), ...args));
    },
    warning: (...args: string[]) => {
      return command.log(chalk(warning(), ...args));
    },
    write: (...args: string[]) => {
      return command.log(chalk(...args));
    },
  };
};

const pending = () => {
  return chalk.reset.inverse.blueBright(" PENDING ");
};

const success = () => {
  return chalk.reset.inverse.greenBright(" SUCCESS ");
};

const error = () => {
  return chalk.reset.inverse.red(" ERROR ");
};

const warning = () => {
  return chalk.reset.inverse.yellowBright(" WARNING ");
};

export const label = (...args: Array<string | number>) => {
  return chalk.grey(...args);
};

export const value = (...args: Array<string | number>) => {
  return chalk.bold.white(...args);
};
