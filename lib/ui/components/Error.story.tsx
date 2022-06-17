import React from "react";
import { render } from "ink";
import { Error } from "@components/Error";
import { Command, Flags } from "@oclif/core";
import { parseArgs } from "@services/story";
import { Layout } from "@components/Layout";

class Example extends Command {
  static flags = {
    label: Flags.string(),
  };

  async run() {
    const { flags } = await this.parse(Example);
    render(
      <Layout>
        <Error {...flags} />
      </Layout>,
      { debug: false }
    );
  }
}

const args = parseArgs();
Example.run(args);
