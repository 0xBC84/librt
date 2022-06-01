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
import {
  Account,
  getChainByWCId,
  getAccounts,
  useWCClient,
} from "@services/blockchain";
import { IEngine, ISignClient, SignClientTypes } from "@walletconnect/types";
import EventEmitter from "node:events";
import { truncateAddress } from "@services/common";
import { Chain } from "@librt/chain";

type SessionApprovalResponse = Awaited<ReturnType<IEngine["approve"]>>;

const CLI_EVENT_SESSION_REVIEW_APPROVED = "session.review.approved";
const CLI_EVENT_SESSION_REVIEW_DENIED = "session.review.denied";
const CLI_EVENT_SESSION_APPROVED = "session.approved";
const CLI_EVENT_SESSION_SUCCESS = "session.success";
const CLI_EVENT_EXCEPTION = "exception";

const cli = new EventEmitter();
const cliCatchException = (error: any) => {
  cli.emit(CLI_EVENT_EXCEPTION, error.message);
};

// @todo Throw error if networks not found.
const SessionApproval = ({
  onApproved,
  onDenied,
  proposal,
}: {
  onApproved: (accounts: Account[]) => void;
  onDenied: () => void;
  proposal: SignClientTypes.EventArguments["session_proposal"];
}) => {
  let isComplete = false;
  const accounts = getAccounts();
  const [selected, setSelected] = useState(0);
  const [approved, setApproved] = useState<number[]>([]);

  // @todo Suport multiple namespaces.
  // @todo Throw error if namespace not found.
  const namespace = proposal.params.requiredNamespaces.eip155;

  // @todo Filter any accounts not on proposal
  const accountList = accounts
    .filter((account) => {
      const chain = [account.protocol, account.network].join(":");
      return namespace.chains.includes(chain);
    })
    .map((wallet) => ({
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

const SessionInfo = ({
  proposal,
}: {
  proposal: SignClientTypes.EventArguments["session_proposal"];
}) => {
  const labelWidth = 15;
  const metadata = proposal.params.proposer.metadata;

  // @todo Support multiple namespaces.
  // @todo Throw error if not found.
  const namespace = proposal.params.requiredNamespaces.eip155;

  const chains: Chain[] = [];
  const chainsUnsupported: string[] = [];
  const permissions = Object.values(namespace.methods) || [];

  for (const chain of namespace.chains) {
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
          {proposal.params.relays.map((relay) => (
            <Text key={relay.protocol}>{relay.protocol}</Text>
          ))}
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

const SegmentPairProposal = ({ wc, uri }: { wc: ISignClient; uri: string }) => {
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

const SegmentSessionApproval = ({
  wc,
  proposal,
  accounts,
}: {
  wc: ISignClient;
  proposal: SignClientTypes.EventArguments["session_proposal"];
  accounts: Account[];
}) => {
  const methods = [
    "eth_requestAccounts",
    "eth_accounts",
    "eth_chainId",
    "eth_sendTransaction",
    "eth_signTransaction",
    "eth_sign",
    "eth_signTypedData",
    "personal_sign",
  ];

  const events = ["chainChanged", "accountsChanged"];

  const indicator = useIndicator({
    onTimeout: () => {
      cli.emit(CLI_EVENT_EXCEPTION, "request timed out");
    },
    onLoad: () => {
      return wc
        .approve({
          id: proposal.id,
          namespaces: {
            eip155: {
              accounts: accounts.map((account) => account.id),
              events,
              methods,
            },
          },
        })
        .then((result) => {
          cli.emit(CLI_EVENT_SESSION_APPROVED, result);
        });
    },
  });

  return (
    <Indicator
      indicator={indicator}
      label="approving session"
      key="do-pair-proposal"
    />
  );
};

const SegmentSessionAcknowledge = ({
  response,
  cli,
}: {
  response: SessionApprovalResponse;
  cli: EventEmitter;
}) => {
  const indicator = useIndicator({
    onTimeout: () => {
      cli.emit(CLI_EVENT_EXCEPTION, "request timed out");
    },
    onLoad: () => {
      return response
        .acknowledged()
        .then(() => cli.emit(CLI_EVENT_SESSION_SUCCESS))
        .catch(() => {
          cli.emit(CLI_EVENT_EXCEPTION, "acknowledge failed");
        });
    },
  });

  return (
    <>
      <Indicator
        key="do-session-proposal"
        label="acknowledging session"
        indicator={indicator}
      />
    </>
  );
};

const SegmentSessionReview = ({
  cli,
  proposal,
}: {
  cli: EventEmitter;
  proposal: SignClientTypes.EventArguments["session_proposal"];
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
          proposal={proposal}
          onApproved={doSessionApproved}
          onDenied={doSessionDenied}
        />
      </Box>
    </>
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

const SegmentSessionDone = () => {
  return (
    <Box>
      <Text>
        <Done /> session created
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

  const { client: wc } = useWCClient({
    exceptionHandler: cliCatchException,
  });

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
      wc.events.once(
        "session_proposal",
        (proposal: SignClientTypes.EventArguments["session_proposal"]) => {
          setComponents((components: React.ReactNode[]) => [
            ...components,
            <SegmentSessionReview
              cli={cli}
              proposal={proposal}
              key="do-session-proposal"
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
        (
          proposal: SignClientTypes.EventArguments["session_proposal"],
          accounts: Account[]
        ) => {
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
      cli.once(
        CLI_EVENT_SESSION_APPROVED,
        (response: SessionApprovalResponse) => {
          setComponents((components: React.ReactNode[]) => [
            ...components,
            <SegmentSessionAcknowledge
              cli={cli}
              key="do-session-acknowledge"
              response={response}
            />,
          ]);
        }
      );
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

  useEffect(() => {
    cli.once(CLI_EVENT_SESSION_SUCCESS, () => {
      setComponents((components: React.ReactNode[]) => [
        ...components,
        <SegmentSessionDone key="session-done" />,
      ]);

      setTimeout(() => {
        process.exit();
      }, 500);
    });
  }, []);

  return <>{components}</>;
};

// @todo Disconnect.
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
