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
