import React from "react";
import { render } from "ink";
import { Indicator, useIndicator } from "@components/Indicator";
import { Command, Flags } from "@oclif/core";

const Indicate = () => {
  const indicator = useIndicator({
    onTimeout: () => {
      process.exit(0);
    },
    onLoad: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 3000);
      });
    },
  });

  return <Indicator indicator={indicator} label="loading" />;
};

class Example extends Command {
  static flags = {};

  async run() {
    const { flags } = await this.parse(Example);
    render(<Indicate {...flags} />, { debug: false });
  }
}

const args = [...process.argv];
args.splice(0, 3);
Example.run(args);
