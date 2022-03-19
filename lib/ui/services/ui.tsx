import { useEffect } from "react";

// Forces the process to exit on CTRL-C.
export const useForceProcessExit = () => {
  useEffect(() => {
    return () => process.exit();
  }, []);
};
