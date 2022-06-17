import React from "react";
import { render } from "ink";
import { DataList } from "@components/DataList";
import { Command, Flags } from "@oclif/core";
import { parseArgs } from "@services/story";
import { Layout } from "@components/Layout";

const data = [
  { label: "name", value: ["vitalk"] },
  { label: "occupation", value: ["software engineer", "project lead"] },
  { label: "location", value: ["unknown"] },
];

class Example extends Command {
  static flags = {
    label: Flags.string(),
  };

  async run() {
    const { flags } = await this.parse(Example);
    render(
      <Layout>
        <DataList data={data} {...flags} />
      </Layout>,
      { debug: false }
    );
  }
}

const args = parseArgs();
Example.run(args);
