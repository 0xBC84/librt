import React, { useEffect, useRef, useState } from "react";
import { Box, Text } from "ink";
import { Info } from "@components/Info";

export const Indicator = ({
  label,
  handler,
}: {
  label: string;
  handler?: () => Promise<any>;
}) => {
  const limit = 3;

  const interval = useRef<NodeJS.Timer | null>(null);
  const [isDone, setDone] = useState(!handler);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (handler && interval.current) {
      handler().finally(() => {
        if (interval.current) clearInterval(interval.current);
        setDone(true);
        setStep(limit);
      });
    }
  }, [interval.current]);

  useEffect(() => {
    interval.current = setInterval(() => {
      setStep((step) => (step + 1) % (limit + 1));
    }, 250);

    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, []);

  // prettier-ignore
  const ellipsisDot = Array.from({ length: step })
    .fill(".")
    .join("")

  const ellipsisSpace = Array.from({ length: limit - step })
    .fill(" ")
    .join("");

  const ellipsis = isDone ? "..." : ellipsisDot + ellipsisSpace;

  return (
    <Box>
      <Text>
        <Info />
        <>
          <> </>
          {label} {ellipsis}
          <> </>
        </>
        {isDone && "done"}
      </Text>
    </Box>
  );
};
