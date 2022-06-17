import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Box, Text } from "ink";
import { Info } from "@components/Info";

type IndicatorHookBindings = {
  doLoad: () => Promise<unknown>;
  isLoading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  isComplete: boolean;
  setComplete: Dispatch<SetStateAction<boolean>>;
  isError: boolean;
  setError: Dispatch<SetStateAction<boolean>>;
};

export const useIndicator = ({
  onLoad,
  onTimeout,
  timeoutMs = 10_000,
}: {
  onLoad: () => Promise<any>;
  onTimeout?: () => void;
  timeoutMs?: number;
}): IndicatorHookBindings => {
  const [isLoading, setLoading] = useState(false);
  const [isComplete, setComplete] = useState(false);
  const [isError, setError] = useState(false);

  // eslint-disable-next-line prefer-const
  let timeout = useRef<NodeJS.Timeout | null>(null);

  const doLoad = () => {
    setLoading(true);
    let isResolved = false;

    // Fire off load hook.
    const load = onLoad()
      .then(() => {
        isResolved = true;
      })
      .catch(() => setError(true));

    // Fire off timeout hook.
    const timer = new Promise((resolve) => {
      timeout.current = setTimeout(() => {
        if (!isResolved) {
          setError(true);
          onTimeout && onTimeout();
        }

        resolve(null);
      }, timeoutMs);
    });

    // Resolve load or timeout, depending on which is first.
    return Promise.race([load, timer]).finally(() => {
      if (timeout.current) clearTimeout(timeout.current);
      setComplete(true);
      setLoading(false);
    });
  };

  return {
    doLoad,
    isLoading,
    setLoading,
    isComplete,
    setComplete,
    isError,
    setError,
  };
};

export const Indicator = ({
  label,
  indicator,
}: {
  label: string;
  indicator: IndicatorHookBindings;
}) => {
  const limit = 3;
  const interval = useRef<NodeJS.Timer | null>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    indicator.doLoad().finally(() => {
      if (interval.current) clearInterval(interval.current);
      setStep(limit);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    interval.current = setInterval(() => {
      setStep((step) => (step + 1) % (limit + 1));
    }, 250);

    if (indicator.isComplete) {
      clearInterval(interval.current);
    }

    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, [indicator.isComplete]);

  // prettier-ignore
  const ellipsisDot = Array.from({ length: step })
    .fill(".")
    .join("")

  const ellipsisSpace = Array.from({ length: limit - step })
    .fill(" ")
    .join("");

  const ellipsis = indicator.isComplete ? "..." : ellipsisDot + ellipsisSpace;
  const message = indicator.isError ? "error" : "done";

  return (
    <Box>
      <Text>
        <Info />
        <>
          <> </>
          {label} {ellipsis}
          <> </>
        </>
        {indicator.isComplete && message}
      </Text>
    </Box>
  );
};
