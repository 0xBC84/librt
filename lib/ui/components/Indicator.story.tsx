import React from "react";
import { render } from "ink";
import { Indicator, useIndicator } from "@components/Indicator";
import { Command } from "@oclif/core";
import { parseArgs } from "@services/story";
import { Layout } from "@components/Layout";

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
    render(
      <Layout>
        <Indicate {...flags} />
      </Layout>,
      { debug: false }
    );
  }
}

const args = parseArgs();
Example.run(args);
