import React, { useEffect } from "react";
import { Box, Text, render, useApp, useFocusManager } from "ink";
import { Options, OptionsProps } from "@components/Options";
import { Command, Flags } from "@oclif/core";
import { parseArgs } from "@services/story";
import { Layout } from "@components/Layout";

const data = [
  {
    id: "1",
    prefix: "11.10.22 10:32",
    label: "Oasis",
    description: "Sign Message",
    suffix: "compound.app",
  },
  {
    id: "2",
    prefix: "11.10.22",
    label: "Oasis",
    description: "Sign Message",
    suffix: "compound.app",
  },
];

const ModeRender = () => {
  const { focus } = useFocusManager();
  const { exit } = useApp();

  useEffect(() => {
    focus("1");
  }, [focus]);

  const onSubmit: OptionsProps["onSubmit"] = (data) => {
    // eslint-disable-next-line no-console
    console.log(data);
    exit();
  };

  const onCancel = () => {
    exit();
  };

  const data = [
    {
      id: "1",
      render: (
        <Box>
          <Text>Hello, World!</Text>
        </Box>
      ),
    },
  ];

  return (
    <Box flexDirection="column">
      <Options
        id="1"
        data={data}
        prefixJustify={true}
        onSubmit={onSubmit}
        onCancel={onCancel}
      ></Options>
    </Box>
  );
};

const ModeSelectSingle = () => {
  const { focus } = useFocusManager();
  const { exit } = useApp();

  useEffect(() => {
    focus("1");
  }, [focus]);

  const onSubmit: OptionsProps["onSubmit"] = (data) => {
    // eslint-disable-next-line no-console
    console.log(data);
    exit();
  };

  const onCancel = () => {
    exit();
  };

  return (
    <Box flexDirection="column">
      <Options
        id="1"
        isSelectSingle={true}
        data={data}
        prefixJustify={true}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </Box>
  );
};

const ModeOptionSingle = () => {
  const { focus } = useFocusManager();
  const { exit } = useApp();

  useEffect(() => {
    focus("1");
  }, [focus]);

  const onSubmit: OptionsProps["onSubmit"] = (data) => {
    // eslint-disable-next-line no-console
    console.log(data);
    exit();
  };

  const onCancel = () => {
    exit();
  };

  return (
    <Box flexDirection="column">
      <Options
        id="1"
        isSelectSingle={true}
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

  const onSubmit: OptionsProps["onSubmit"] = (data) => {
    // eslint-disable-next-line no-console
    console.log(data);
    exit();
  };

  const onCancel = () => {
    exit();
  };

  return (
    <Box flexDirection="column">
      <Options
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

  const onSubmit1: OptionsProps["onSubmit"] = (data) => {
    focus("2");
    // eslint-disable-next-line no-console
    console.log(data);
  };

  const onSubmit2: OptionsProps["onSubmit"] = (data) => {
    // eslint-disable-next-line no-console
    console.log(data);
    exit();
  };

  const onCancel = () => {
    exit();
  };

  return (
    <Box flexDirection="column">
      <Options
        id="1"
        data={data}
        prefixJustify={true}
        onSubmit={onSubmit1}
        onCancel={onCancel}
      />
      <Box marginTop={1}>
        <Options
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
  Render = "render",
  SelectSingle = "select-single",
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
        {flags.mode === Mode.Render && <ModeRender />}
        {flags.mode === Mode.SelectSingle && <ModeSelectSingle />}
      </Layout>,
      { debug: false }
    );
  }
}

const args = parseArgs();
Example.run(args);
