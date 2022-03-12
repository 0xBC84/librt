import React from "react";
import { Command } from "@oclif/core";
import { render, Text } from "ink";
import { Layout } from "@librt/ui";

const PairConnect = () => {
  return <Text>Connect</Text>;
};

export default class PairConnectCommand extends Command {
  static description = "Create a pair connection.";

  static examples = [`$ wallet pair:connect`];

  // @todo URI flag.
  static flags = {};

  static args = [];

  async run(): Promise<void> {
    render(
      <>
        <Layout>
          <PairConnect />
        </Layout>
      </>
    );
  }
}
