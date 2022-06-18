import React, { useRef, useState } from "react";
import { Box, Text, useFocus, useInput } from "ink";
import { getMinWidthFromKey } from "@services/ui";

const SPACING = 1;

type OptionsData = {
  prefix?: string;
  label: string;
  description?: string;
  suffix?: string;
};

export type OptionsKeyProps = {
  id: string;
  prefixJustify?: boolean;
  labelJustify?: boolean;
  descriptionJustify?: boolean;
  suffixJustify?: boolean;
  onSubmit: (data: Array<OptionsData>) => void;
  onCancel: () => void;
  data: Array<OptionsData>;
};

export const OptionsKey = (props: OptionsKeyProps) => {
  const {
    data,
    id,
    prefixJustify,
    labelJustify,
    descriptionJustify,
    suffixJustify,
    onSubmit,
    onCancel,
  } = props;

  const isModeMulti = data.length > 1;
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

    if (input === " ") {
      toggleConfirmed(selected);
    }

    if (key.downArrow) {
      if (selected >= data.length - 1) return;
      setSelected((selected) => selected + 1);
    }

    if (key.upArrow) {
      if (selected === 0) return;
      setSelected((selected) => selected - 1);
    }

    if (key.return) {
      isComplete.current = true;
      if (isModeMulti) {
        const _confirmed = data.filter((_, i) => confirmed.includes(i));
        onSubmit(_confirmed);
      } else {
        onSubmit(data);
      }
    }

    if (key.escape) {
      isComplete.current = true;
      onCancel();
      // onDenied();
    }
  });

  const options = data.map((data, i) => {
    const isBold = isSelected(i);
    const colorPrimary = isSelected(i) ? "yellowBright" : "yellow";

    return (
      <Box flexDirection="row" key={data.label + i}>
        {isModeMulti && (
          <Box marginRight={SPACING}>
            <Text color={colorPrimary} bold>
              {isSelected(i) ? "›" : " "}
            </Text>
          </Box>
        )}
        {isModeMulti && (
          <Box marginRight={SPACING}>
            <Text color={colorPrimary} bold={isBold}>
              {isConfirmed(i) ? "[•]" : "[ ]"}
            </Text>
          </Box>
        )}
        {data.prefix && (
          <Box marginRight={SPACING} minWidth={minWidthPrefix}>
            <Text color="grey">{data.prefix}</Text>
          </Box>
        )}
        <Box marginRight={SPACING} minWidth={minWidthLabel}>
          <Text color={colorPrimary}>{data.label}</Text>
        </Box>
        {data.description && (
          <Box marginRight={SPACING} minWidth={minWidthDescription}>
            <Text>{data.description}</Text>
          </Box>
        )}
        {data.suffix && (
          <Box marginRight={SPACING} minWidth={minWidthSuffix}>
            <Text color="grey">{data.suffix}</Text>
          </Box>
        )}
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
        {isModeMulti && (
          <Box marginRight={SPACING}>
            <Text color="grey">[SPACE] </Text>
            <Text>select</Text>
          </Box>
        )}
        {isModeMulti && (
          <Box marginRight={SPACING}>
            <Text color="grey">[↑] </Text>
            <Text>up</Text>
          </Box>
        )}
        {isModeMulti && (
          <Box marginRight={SPACING}>
            <Text color="grey">[↓] </Text>
            <Text>down</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};
