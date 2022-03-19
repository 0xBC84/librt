import React, { useEffect, useState } from "react";
import { Command, Flags } from "@oclif/core";
import { Box, render, Text, useInput } from "ink";
import {
  Done,
  Error,
  Indicator,
  Info,
  Layout,
  useForceProcessExit,
  useIndicator,
} from "@librt/ui";
import WalletConnectClient, { CLIENT_EVENTS } from "@walletconnect/client";
import {
  Account,
  getChainByWCId,
  getAccounts,
  useWCClient,
} from "@services/blockchain";
import { SessionTypes } from "@walletconnect/types";
import EventEmitter from "node:events";
import { truncateAddress } from "@services/common";
import { Chain } from "@librt/chain";

const CLI_EVENT_SESSION_REVIEW_APPROVED = "session.review.approved";
const CLI_EVENT_SESSION_REVIEW_DENIED = "session.review.denied";
const CLI_EVENT_EXCEPTION = "exception";

const cli = new EventEmitter();
const cliCatchException = (error: any) => {
  cli.emit(CLI_EVENT_EXCEPTION, error.message);
};

const SessionApproval = ({
  onApproved,
  onDenied,
}: {
  onApproved: (accounts: Account[]) => void;
  onDenied: () => void;
}) => {
  let isComplete = false;
  const accounts = getAccounts();
  const [selected, setSelected] = useState(0);
  const [approved, setApproved] = useState<number[]>([]);

  const accountList = accounts.map((wallet) => ({
    address: wallet.address,
    tags: [wallet.name, wallet.chain.chain, wallet.chain.name].join(", "),
  }));

  const isSelected = (i: number) => {
    return i === selected;
  };

  const isApproved = (i: number) => {
    return approved.includes(i);
  };

  const toggleApproved = (i: number) => {
    if (isApproved(i)) {
      setApproved((approved) => {
        const _approved = [...approved];
        _approved.splice(i, 1);
        return _approved;
      });
    } else {
      setApproved((approved) => [...approved, i]);
    }
  };

  useInput((input, key) => {
    if (input === " ") {
      toggleApproved(selected);
    }

    if (key.downArrow) {
      if (selected >= accountList.length - 1) return;
      setSelected((selected) => selected + 1);
    }

    if (key.upArrow) {
      if (selected === 0) return;
      setSelected((selected) => selected - 1);
    }

    if (key.return && !isComplete) {
      isComplete = true;
      const approvedAccounts = accounts.filter((_, i) => approved.includes(i));
      if (approved.length > 0) onApproved(approvedAccounts);
      else onDenied();
    }

    if (key.escape && !isComplete) {
      isComplete = true;
      onDenied();
    }
  });

  return (
    <>
      <Box flexDirection="column">
        {accountList.map((account, i) => (
          <Box flexDirection="row" key={account.address}>
            <Box minWidth={2}>
              {isSelected(i) && <Text color="yellowBright">•</Text>}
            </Box>
            <Text color="yellowBright">{isApproved(i) ? "[-]" : "[ ]"}</Text>
            <Text> </Text>
            <Text color="yellowBright">{truncateAddress(account.address)}</Text>
            <Text> </Text>
            <Text color="grey">{account.tags}</Text>
          </Box>
        ))}
        <Box marginTop={1} />
        <Box flexDirection="row">
          <Text>
            <Text color="yellow">[ENTER] </Text>
            <Text>approve </Text>
          </Text>
          <Text>
            <Text color="yellow">[ESC] </Text>
            <Text>deny </Text>
          </Text>
          <Text>
            <Text color="yellow">[SPACE] </Text>
            <Text>select </Text>
          </Text>
        </Box>
      </Box>
    </>
  );
};

const SessionInfo = ({ proposal }: { proposal: SessionTypes.Proposal }) => {
  const labelWidth = 15;
  const metadata = proposal.proposer.metadata;

  const chains: Chain[] = [];
  const chainsUnsupported: string[] = [];
  const permissions = Object.values(proposal.permissions.jsonrpc.methods) || [];

  for (const chain of proposal.permissions.blockchain.chains) {
    try {
      const chainData = getChainByWCId(chain);
      if (chainData) chains.push(chainData);
    } catch {
      chainsUnsupported.push(chain);
    }
  }

  return (
    <Box flexDirection="column">
      <Box flexDirection="row">
        <Box minWidth={labelWidth}>
          <Text color="grey">name:</Text>
        </Box>
        <Box>
          <Text>{metadata.name}</Text>
        </Box>
      </Box>
      <Box flexDirection="row">
        <Box minWidth={labelWidth}>
          <Text color="grey">URL:</Text>
        </Box>
        <Box>
          <Text>{metadata.url}</Text>
        </Box>
      </Box>
      <Box flexDirection="row">
        <Box minWidth={labelWidth}>
          <Text color="grey">blockchain:</Text>
        </Box>
        <Box flexDirection="column">
          {chains.map((chain) => (
            <Text key={chain.chainId}>
              {chain.name} {chain?.chain ? `(${chain.chain})` : null}
            </Text>
          ))}
          {chainsUnsupported.map((chain) => (
            <Text key={chain}>{chain} (unsupported)</Text>
          ))}
        </Box>
      </Box>
      <Box flexDirection="row">
        <Box minWidth={labelWidth}>
          <Text color="grey">relay:</Text>
        </Box>
        <Box>
          <Text>{proposal.relay.protocol}</Text>
        </Box>
      </Box>
      <Box flexDirection="row">
        <Box minWidth={labelWidth}>
          <Text color="grey">methods:</Text>
        </Box>
        <Box flexDirection="column">
          {permissions.map((permission) => (
            <Text key={permission}>{permission}</Text>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const SegmentPairProposal = ({
  wc,
  uri,
}: {
  wc: WalletConnectClient;
  uri: string;
}) => {
  const indicator = useIndicator({
    onTimeout: () => {
      cli.emit(CLI_EVENT_EXCEPTION, "request timed out");
    },
    onLoad: () => {
      return wc.pair({ uri }).catch(cliCatchException);
    },
  });

  return (
    <Indicator
      indicator={indicator}
      label="attempting to pair"
      key="do-pair-proposal"
    />
  );
};

const SegmentSessionProposal = ({ wc }: { wc: WalletConnectClient }) => {
  const indicator = useIndicator({
    onTimeout: () => {
      cli.emit(CLI_EVENT_EXCEPTION, "request timed out");
    },
    onLoad: () => {
      return new Promise((resolve) => {
        wc.on(CLIENT_EVENTS.session.proposal, () => {
          resolve(null);
        });
      });
    },
  });

  return (
    <Indicator
      key="do-session-proposal"
      label="waiting for session proposals"
      indicator={indicator}
    />
  );
};

const SegmentSessionReview = ({
  cli,
  proposal,
}: {
  cli: EventEmitter;
  proposal: SessionTypes.Proposal;
}) => {
  const doSessionApproved = (accounts: Account[]) => {
    cli.emit(CLI_EVENT_SESSION_REVIEW_APPROVED, proposal, accounts);
  };

  const doSessionDenied = () => {
    cli.emit(CLI_EVENT_SESSION_REVIEW_DENIED, proposal);
  };

  return (
    <>
      <Text>
        <Info /> session proposed:
      </Text>
      <Box marginTop={1}>
        <SessionInfo proposal={proposal} />
      </Box>
      <Box marginTop={1} marginBottom={1}>
        <SessionApproval
          onApproved={doSessionApproved}
          onDenied={doSessionDenied}
        />
      </Box>
    </>
  );
};

const SegmentSessionApproval = ({
  wc,
  proposal,
  accounts,
}: {
  wc: WalletConnectClient;
  proposal: SessionTypes.Proposal;
  accounts: Account[];
}) => {
  const response = {
    state: {
      accounts: accounts.map((account) => account.id),
    },
  };

  const indicator = useIndicator({
    timeout: 30_000,
    onTimeout: () => {
      cli.emit(CLI_EVENT_EXCEPTION, "request timed out");
    },
    onLoad: () => {
      return wc.approve({ proposal, response }).catch(cliCatchException);
    },
  });

  return (
    <Box>
      <Indicator label="waiting for session approval" indicator={indicator} />
    </Box>
  );
};

const SegmentSessionApproved = () => {
  return (
    <Box>
      <Text>
        <Done /> session created
      </Text>
    </Box>
  );
};

const SegmentSessionDenied = () => {
  return (
    <Box>
      <Text>
        <Info /> session denied
      </Text>
    </Box>
  );
};

const SegmentSessionException = ({
  message = "something went wrong.",
}: {
  message?: string;
}) => {
  return (
    <Box>
      <Text>
        <Error /> {message}
      </Text>
    </Box>
  );
};

const PairConnect = ({ uri }: { uri: string }) => {
  // @todo Remove and gracefully exit on CTRL-C.
  useForceProcessExit();

  const { client: wc } = useWCClient({ exceptionHandler: cliCatchException });
  const [components, setComponents] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    if (wc) {
      setComponents([
        <SegmentPairProposal key="do-pair-proposal" wc={wc} uri={uri} />,
      ]);
    }
  }, [wc, uri]);

  useEffect(() => {
    if (wc) {
      wc.once(CLIENT_EVENTS.pairing.created, () => {
        setComponents((components: React.ReactNode[]) => [
          ...components,
          <SegmentSessionProposal wc={wc} key="do-session-proposal" />,
        ]);
      });
    }
  }, [wc]);

  useEffect(() => {
    if (wc) {
      wc.once(
        CLIENT_EVENTS.session.proposal,
        (proposal: SessionTypes.Proposal) => {
          setComponents((components: React.ReactNode[]) => [
            ...components,
            <SegmentSessionReview
              key="do-session-reviewed"
              cli={cli}
              proposal={proposal}
            />,
          ]);
        }
      );
    }
  }, [wc]);

  useEffect(() => {
    if (wc) {
      cli.once(
        CLI_EVENT_SESSION_REVIEW_APPROVED,
        (proposal: SessionTypes.Proposal, accounts: Account[]) => {
          setComponents((components: React.ReactNode[]) => [
            ...components,
            <SegmentSessionApproval
              key="do-session-approval"
              wc={wc}
              proposal={proposal}
              accounts={accounts}
            />,
          ]);
        }
      );
    }
  }, [wc]);

  useEffect(() => {
    if (wc) {
      wc.once(CLIENT_EVENTS.session.created, () => {
        setComponents((components: React.ReactNode[]) => [
          ...components,
          <SegmentSessionApproved key="session-approved" />,
        ]);

        setTimeout(() => {
          process.exit();
        }, 500);
      });
    }
  }, [wc]);

  useEffect(() => {
    cli.once(CLI_EVENT_SESSION_REVIEW_DENIED, () => {
      setComponents((components: React.ReactNode[]) => [
        ...components,
        <SegmentSessionDenied key="session-denied" />,
      ]);

      setTimeout(() => {
        process.exit();
      }, 500);
    });
  }, []);

  useEffect(() => {
    cli.on(CLI_EVENT_EXCEPTION, (message: string) => {
      setComponents((components: React.ReactNode[]) => [
        ...components,
        <SegmentSessionException key="exception" message={message} />,
      ]);

      setTimeout(() => {
        process.exit();
      }, 500);
    });
  }, []);

  return <>{components}</>;
};

export default class PairConnectCommand extends Command {
  static description = "Create a pair connection.";

  static examples = [`$ wallet pair:connect --uri=<uri>`];

  static flags = {
    uri: Flags.string({
      char: "u",
      description: "Connection URI",
      required: true,
    }),
  };

  static args = [];

  async run(): Promise<void> {
    const { flags } = await this.parse(PairConnectCommand);

    render(
      <>
        <Layout>
          <PairConnect uri={flags.uri} />
        </Layout>
      </>
    );
  }
}
