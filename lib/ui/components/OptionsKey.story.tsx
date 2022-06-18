import React, { useEffect } from "react";
import { Box, render, useApp, useFocusManager } from "ink";
import { OptionsKey, OptionsKeyProps } from "@components/OptionsKey";
import { Command, Flags } from "@oclif/core";
import { parseArgs } from "@services/story";
import { Layout } from "@components/Layout";

const data = [
  {
    prefix: "11.10.22 10:32",
    label: "Oasis",
    description: "Sign Message",
    suffix: "compound.app",
  },
  {
    prefix: "11.10.22",
    label: "Oasis",
    description: "Sign Message",
    suffix: "compound.app",
  },
];

const ModeOptionSingle = () => {
  const { focus } = useFocusManager();
  const { exit } = useApp();

  useEffect(() => {
    focus("1");
  }, [focus]);

  const onSubmit: OptionsKeyProps["onSubmit"] = (data) => {
    // eslint-disable-next-line no-console
    console.log(data);
    exit();
  };

  const onCancel = () => {
    exit();
  };

  return (
    <Box flexDirection="column">
      <OptionsKey
        id="1"
        data={[data[0]]}
        prefixJustify={true}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </Box>
  );
};

const ModeInputSingle = () => {
  const { focus } = useFocusManager();
  const { exit } = useApp();

  useEffect(() => {
    focus("1");
  }, [focus]);

  const onSubmit: OptionsKeyProps["onSubmit"] = (data) => {
    // eslint-disable-next-line no-console
    console.log(data);
    exit();
  };

  const onCancel = () => {
    exit();
  };

  return (
    <Box flexDirection="column">
      <OptionsKey
        id="1"
        data={data}
        prefixJustify={true}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </Box>
  );
};

const ModeInputMulti = () => {
  const { focus } = useFocusManager();
  const { exit } = useApp();

  useEffect(() => {
    focus("1");
  }, [focus]);

  const onSubmit1: OptionsKeyProps["onSubmit"] = (data) => {
    focus("2");
    // eslint-disable-next-line no-console
    console.log(data);
  };

  const onSubmit2: OptionsKeyProps["onSubmit"] = (data) => {
    // eslint-disable-next-line no-console
    console.log(data);
    exit();
  };

  const onCancel = () => {
    exit();
  };

  return (
    <Box flexDirection="column">
      <OptionsKey
        id="1"
        data={data}
        prefixJustify={true}
        onSubmit={onSubmit1}
        onCancel={onCancel}
      />
      <Box marginTop={1}>
        <OptionsKey
          id="2"
          data={data}
          prefixJustify={true}
          onSubmit={onSubmit2}
          onCancel={onCancel}
        />
      </Box>
    </Box>
  );
};

enum Mode {
  InputSingle = "input-single",
  InputMulti = "input-multi",
  OptionSingle = "option-single",
}

class Example extends Command {
  static flags = {
    mode: Flags.string({
      default: Mode.InputSingle,
      description: Object.values(Mode).join(","),
    }),
  };

  async run() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { flags } = await this.parse(Example);

    render(
      <Layout>
        {flags.mode === Mode.InputSingle && <ModeInputSingle />}
        {flags.mode === Mode.InputMulti && <ModeInputMulti />}
        {flags.mode === Mode.OptionSingle && <ModeOptionSingle />}
      </Layout>,
      { debug: false }
    );
  }
}

const args = parseArgs();
Example.run(args);
