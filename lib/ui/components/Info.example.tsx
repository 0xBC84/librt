import React from "react";
import { render } from "ink";
import { Info } from "@components/Info";
import { Command, Flags } from "@oclif/core";
import { parseArgs } from "@services/display";

class Example extends Command {
  static flags = {
    label: Flags.string(),
  };

  async run() {
    const { flags } = await this.parse(Example);
    render(<Info {...flags} />, { debug: false });
  }
}

const args = parseArgs();
Example.run(args);
