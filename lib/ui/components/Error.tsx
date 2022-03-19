import React from "react";
import { Text } from "ink";

export const Error = ({ label = "FAIL" }: { label?: string }) => {
  return <Text color="redBright">[{label}]</Text>;
};
