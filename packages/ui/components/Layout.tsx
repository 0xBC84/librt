import React from "react";
import { Box } from "ink";

export const Layout: React.FC = ({ children }) => {
  return (
    <Box paddingX={2} paddingY={1} flexDirection="column">
      {children}
    </Box>
  );
};
