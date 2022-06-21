import React, { ReactNode, useRef, useState } from "react";
import { Box, Text, useFocus, useInput } from "ink";
import { getMinWidthFromKey } from "@services/ui";

const SPACING = 1;

type OptionsData = {
  id: string;
  prefix?: string;
  label?: string;
  description?: string;
  suffix?: string;
  render?: ReactNode;
};

export type OptionsProps = {
  id: string;
  prefixJustify?: boolean;
  labelJustify?: boolean;
  descriptionJustify?: boolean;
  suffixJustify?: boolean;
  onSubmit: (data: Array<OptionsData>) => void;
  onCancel: () => void;
  data: Array<OptionsData>;
  isSelectSingle?: boolean;
  isSelectorHidden?: boolean;
};

export const Options = (props: OptionsProps) => {
  const {
    data,
    id,
    prefixJustify,
    labelJustify,
    descriptionJustify,
    suffixJustify,
    onSubmit,
    onCancel,
    isSelectSingle = false,
    isSelectorHidden = false,
  } = props;

  const isComplete = useRef(false);
  const { isFocused } = useFocus({ id });
  const [selected, setSelected] = useState(0);
  const [confirmed, setConfirmed] = useState<number[]>([]);

  const isSelected = (i: number) => {
    return i === selected;
  };

  const isConfirmed = (i: number) => {
    return confirmed.includes(i);
  };

  const minWidthLabel = labelJustify
    ? getMinWidthFromKey(data, "label")
    : undefined;

  const minWidthPrefix = prefixJustify
    ? getMinWidthFromKey(data, "prefix")
    : undefined;

  const minWidthSuffix = suffixJustify
    ? getMinWidthFromKey(data, "suffix")
    : undefined;

  const minWidthDescription = descriptionJustify
    ? getMinWidthFromKey(data, "description")
    : undefined;

  const toggleConfirmed = (i: number) => {
    if (isConfirmed(i)) {
      setConfirmed((confirmed) => {
        return confirmed.filter((c) => c !== i);
      });
    } else {
      setConfirmed((confirmed) => [...confirmed, i]);
    }
  };

  useInput((input, key) => {
    if (isComplete.current || !isFocused) return;

    if (input === " " && !isSelectSingle) {
      toggleConfirmed(selected);
    }

    if (key.downArrow) {
      if (selected >= data.length - 1) return;
      if (isSelectSingle) setConfirmed([selected + 1]);
      setSelected((selected) => selected + 1);
    }

    if (key.upArrow) {
      if (selected === 0) return;
      setSelected((selected) => selected - 1);
    }

    if (key.return) {
      isComplete.current = true;
      if (isSelectSingle) {
        const value = data[selected];
        onSubmit([value]);
      } else {
        const _confirmed = data.filter((_, i) => confirmed.includes(i));
        onSubmit(_confirmed);
      }
    }

    if (key.escape) {
      isComplete.current = true;
      onCancel();
    }
  });

  const options = data.map((data, i) => {
    const { render = null } = data;
    const colorPrimary = isSelected(i) ? "cyanBright" : "cyan";

    return (
      <Box flexDirection="row" key={data.id}>
        {!isSelectorHidden && (
          <Box marginRight={SPACING}>
            <Text color={colorPrimary} bold>
              {isSelected(i) ? "›" : " "}
            </Text>
          </Box>
        )}
        {!isSelectorHidden && !isSelectSingle && (
          <Box marginRight={SPACING}>
            <Text color={colorPrimary}>{isConfirmed(i) ? "[•]" : "[ ]"}</Text>
          </Box>
        )}
        {!render && data.prefix && (
          <Box marginRight={SPACING} minWidth={minWidthPrefix}>
            <Text color="grey">{data.prefix}</Text>
          </Box>
        )}
        {!render && data.label && (
          <Box marginRight={SPACING} minWidth={minWidthLabel}>
            <Text color={colorPrimary}>{data.label}</Text>
          </Box>
        )}
        {!render && data.description && (
          <Box marginRight={SPACING} minWidth={minWidthDescription}>
            <Text>{data.description}</Text>
          </Box>
        )}
        {!render && data.suffix && (
          <Box marginRight={SPACING} minWidth={minWidthSuffix}>
            <Text color="grey">{data.suffix}</Text>
          </Box>
        )}
        {render}
      </Box>
    );
  });

  return (
    <Box flexDirection="column">
      {options}
      <Box flexDirection="row" marginTop={1}>
        <Box marginRight={SPACING}>
          <Text color="greenBright">[ENTER] </Text>
          <Text>confirm</Text>
        </Box>
        <Box marginRight={SPACING}>
          <Text color="redBright">[ESC] </Text>
          <Text>cancel</Text>
        </Box>
        {!isSelectSingle && (
          <Box marginRight={SPACING}>
            <Text color="grey">[SPACE] </Text>
            <Text>select</Text>
          </Box>
        )}
        {!isSelectorHidden && (
          <Box marginRight={SPACING}>
            <Text color="grey">[↑] </Text>
            <Text>up</Text>
          </Box>
        )}
        {!isSelectorHidden && (
          <Box marginRight={SPACING}>
            <Text color="grey">[↓] </Text>
            <Text>down</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};
