import React from "react";
import { Text } from "ink";

export const Info = ({ label = "INFO" }: { label?: string }) => {
  return <Text color="grey">[{label}]</Text>;
};
