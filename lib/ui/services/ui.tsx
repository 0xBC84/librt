import { useEffect } from "react";
import { useApp } from "ink";

// Forces the process to exit on CTRL-C.
export const useForceProcessExit = () => {
  useEffect(() => {
    return () => process.exit();
  }, []);
};

// Exits after elapsed time, useful for rendering final state change.
export const useTimedExit = () => {
  const app = useApp();

  return () =>
    setInterval(() => {
      app.exit();
    }, 1000);
};

export const getMinWidthFromKey = (
  data: Record<string, unknown>[],
  key: string
) => {
  return data.reduce((width, data) => {
    const value = data[key];
    if (!value) return 0;
    if (typeof value !== "string") return 0;
    if (value.length > width) return value.length;
    return width;
  }, 0);
};
