import React from "react";
import { Text } from "ink";

export const Done = ({ label = "DONE" }: { label?: string }) => {
  return <Text color="greenBright">[{label}]</Text>;
};
