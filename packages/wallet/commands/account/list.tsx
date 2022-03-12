import React, { useEffect, useRef, useState } from "react";
import { Command } from "@oclif/core";
import { Box, render, Text, useInput } from "ink";

type AccountListItem = {
  name: string;
  balance: string;
  currencySymbol: string;
  active: boolean;
};

const Info = ({ label = "INFO" }: { label?: string }) => {
  return <Text color="grey">[{label}]</Text>;
};

const Indicator = ({
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
    .join("");

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

// @todo Handle variable widths
const AccountListTable = () => {
  const [selected, setSelected] = useState(0);
  const [saved, setSaved] = useState(false);
  const [accountList, setAccountList] = useState<AccountListItem[]>([]);

  const handler = () =>
    new Promise((resolve) => {
      setTimeout(() => {
        const data: AccountListItem[] = [
          {
            name: "Spending",
            currencySymbol: "ETH",
            balance: "0.00000",
            active: true,
          },
          {
            name: "Saving",
            currencySymbol: "ETH",
            balance: "0.00000",
            active: false,
          },
          {
            name: "Expense",
            currencySymbol: "ETH",
            balance: "0.00000",
            active: false,
          },
        ];

        setAccountList(data);
        resolve(null);
      }, 2000);
    });

  const isSelected = (i: number) => {
    return i === selected;
  };

  useInput((input, key) => {
    if (key.downArrow) {
      if (selected >= accountList.length - 1) return;
      setSelected((selected) => selected + 1);
    }

    if (key.upArrow) {
      if (selected === 0) return;
      setSelected((selected) => selected - 1);
    }

    if (key.return) {
      setSaved(true);
    }
  });

  useEffect(() => {
    if (saved) process.exit();
  }, [saved]);

  return (
    <>
      <Indicator handler={handler} label="fetching accounts" />
      <Box marginTop={1} marginBottom={1} flexDirection="column">
        {accountList.map((account, i) => (
          <Box flexDirection="row" key={account.name}>
            <Box minWidth={2}>
              {isSelected(i) && <Text color="yellowBright">•</Text>}
            </Box>
            <Box minWidth={16}>
              <Text>
                <Text color={isSelected(i) ? "yellowBright" : "yellow"}>
                  {account.name}
                </Text>
              </Text>
            </Box>
            <Box marginRight={1}>
              <Text>
                {account.balance} {account.currencySymbol}
              </Text>
            </Box>
            <Box>
              {account.active && (
                <Text>
                  <Info label="ACTIVE" />
                </Text>
              )}
            </Box>
          </Box>
        ))}
      </Box>
      {saved && <Indicator label="updating accounts" />}
    </>
  );
};

export default class AccountList extends Command {
  static description = "";

  static examples = [`$ wallet account:list`];

  static flags = {};

  static args = [];

  async run(): Promise<void> {
    render(
      <>
        <Box paddingX={2} paddingY={1} flexDirection="column">
          <AccountListTable />
        </Box>
      </>
    );
  }
}
