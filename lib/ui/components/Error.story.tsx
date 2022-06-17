import React from "react";
import { render } from "ink";
import { Error } from "@components/Error";
import { Command, Flags } from "@oclif/core";
import { parseArgs } from "@services/story";

class Example extends Command {
  static flags = {
    label: Flags.string(),
  };

  async run() {
    const { flags } = await this.parse(Example);
    render(<Error {...flags} />, { debug: false });
  }
}

const args = parseArgs();
Example.run(args);
