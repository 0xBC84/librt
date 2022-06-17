import React from "react";
import { Box, Text } from "ink";

export type DataListProps = {
  data: Array<{ label: string; value: string[] }>;
};

export const DataList = ({ data }: DataListProps) => {
  const labelMargin = 5;

  const labelWidth = data.reduce((width, { label }) => {
    if (label.length > width) return label.length;
    return width;
  }, 0);

  const list = data.map((data) => (
    <Box flexDirection="row" key={data.label}>
      <Box minWidth={labelWidth + labelMargin}>
        <Text color="grey">{data.label}:</Text>
      </Box>
      <Box flexDirection="column">
        {data.value.map((value) => (
          <Box key={value}>
            <Text>{value}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  ));

  return <Box flexDirection="column">{list}</Box>;
};
