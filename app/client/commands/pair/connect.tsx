import React, { useEffect, useState } from "react";
import { Command, Flags } from "@oclif/core";
import { Box, render, Text, useFocus } from "ink";
import {
  DataList,
  DataListProps,
  Done,
  Error,
  Indicator,
  Info,
  Layout,
  Options,
  OptionsProps,
  useForceProcessExit,
  useIndicator,
} from "@librt/ui";
import { Account, getChainByWCId, getAccounts } from "@services/blockchain";
import { SignClientTypes } from "@walletconnect/types";
import EventEmitter from "node:events";
import { truncateAddress } from "@services/common";
import { Chain } from "@librt/chain";
import { io, Socket } from "socket.io-client";
import {
  SignClientToServerEvents,
  SignServerToClientEvents,
} from "@librt/core";

const CLI_EVENT_SESSION_REVIEW_APPROVED = "session.review.approved";
const CLI_EVENT_SESSION_REVIEW_DENIED = "session.review.denied";
const CLI_EVENT_EXCEPTION = "exception";

const cli = new EventEmitter();

type SignClientSocket = Socket<
  SignServerToClientEvents,
  SignClientToServerEvents
>;

// @todo Throw error if networks not found.
const SessionApproval = ({
  onApproved,
  onDenied,
  proposal,
}: {
  onApproved: (accounts: string[]) => void;
  onDenied: () => void;
  proposal: SignClientTypes.EventArguments["session_proposal"];
}) => {
  const accounts = getAccounts();
  const { focus } = useFocus();

  useEffect(() => {
    focus("session-approve");
  }, []);

  // @todo Suport multiple namespaces.
  // @todo Throw error if namespace not found.
  const namespace = proposal.params.requiredNamespaces.eip155;

  const handleSubmit: OptionsProps["onSubmit"] = (data) => {
    const values = data.map((data) => data.id);
    if (data.length > 0) onApproved(values);
    else onDenied();
  };

  const handleCancel = () => {
    onDenied();
  };

  const data: OptionsProps["data"] = accounts
    .filter((account) => {
      const chain = [account.protocol, account.network].join(":");
      return namespace.chains.includes(chain);
    })
    .map((account) => ({
      id: account.id,
      label: truncateAddress(account.address),
      suffix: [account.chain.chain, account.chain.name].join(", "),
    }));

  return (
    <Options
      id="session-approve"
      data={data}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

const SessionInfo = ({
  proposal,
}: {
  proposal: SignClientTypes.EventArguments["session_proposal"];
}) => {
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

  const data: DataListProps["data"] = [
    { label: "name", value: [metadata.name] },
    { label: "URL", value: [metadata.url] },
    {
      label: "blockchain",
      value: chains.map((chain) => {
        return [chain.name, chain.chain].filter(Boolean).join(" - ");
      }),
    },
    {
      label: "relay",
      value: proposal.params.relays.map((relay) => relay.protocol),
    },
    { label: "methods", value: permissions },
  ];

  return <DataList data={data} />;
};

const SegmentPairProposal = ({
  socket,
  uri,
}: {
  socket: SignClientSocket;
  uri: string;
}) => {
  const indicator = useIndicator({
    onTimeout: () => {
      cli.emit(CLI_EVENT_EXCEPTION, "request timed out");
    },
    onLoad: () => {
      return new Promise((resolve) => {
        socket.emit("sign_client:pair", { uri });
        socket.on("sign_client:pair_ok", () => resolve(true));
      });
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
  socket,
  proposal,
  accounts,
}: {
  socket: SignClientSocket;
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
      return new Promise((resolve) => {
        const data = {
          id: proposal.id,
          namespaces: {
            eip155: {
              accounts: accounts.map((account) => account.id),
              events,
              methods,
            },
          },
        };

        socket.emit("sign_client:session_approve", data);
        socket.on("sign_client:session_approve_ok", () => resolve(true));
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

const SegmentSessionReview = ({
  cli,
  proposal,
}: {
  cli: EventEmitter;
  proposal: SignClientTypes.EventArguments["session_proposal"];
}) => {
  const accounts = getAccounts();

  const doSessionApproved = (values: string[]) => {
    const _accounts = accounts.filter((account) => {
      return values.includes(account.id);
    });

    cli.emit(CLI_EVENT_SESSION_REVIEW_APPROVED, proposal, _accounts);
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

const SegmentConnect = ({
  onConnect,
}: {
  onConnect: (socket: SignClientSocket) => void;
}) => {
  const indicator = useIndicator({
    onTimeout: () => {
      cli.emit(CLI_EVENT_EXCEPTION, "request timed out");
    },
    onLoad: () => {
      return new Promise((resolve) => {
        const _socket = io("ws://node:3000");
        _socket.on("sign_client:ready", () => {
          resolve(true);
          onConnect(_socket);
        });
      });
    },
  });

  return (
    <Indicator indicator={indicator} label="connecting" key="do-connects" />
  );
};

const PairConnect = ({ uri }: { uri: string }) => {
  // @todo Remove and gracefully exit on CTRL-C.
  useForceProcessExit();

  const [components, setComponents] = useState<React.ReactNode[]>([]);
  const [socket, setSocket] = useState<SignClientSocket | undefined>();

  useEffect(() => {
    setComponents((components: React.ReactNode[]) => [
      ...components,
      <SegmentConnect
        key="do-connect"
        onConnect={(socket) => {
          setSocket(socket);
        }}
      />,
    ]);
  }, []);

  useEffect(() => {
    if (socket) {
      setComponents((components: React.ReactNode[]) => [
        ...components,
        <SegmentPairProposal
          key="do-pair-proposal"
          socket={socket}
          uri={uri}
        />,
      ]);
    }
  }, [uri, socket]);

  useEffect(() => {
    if (socket) {
      socket.once(
        "sign_client:session_proposal",
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
  }, [socket]);

  useEffect(() => {
    // @todo Remove in favour of socket event
    if (socket) {
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
              socket={socket}
              proposal={proposal}
              accounts={accounts}
            />,
          ]);
        }
      );
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      cli.once(CLI_EVENT_SESSION_REVIEW_DENIED, () => {
        setComponents((components: React.ReactNode[]) => [
          ...components,
          <SegmentSessionDenied key="session-denied" />,
        ]);

        setTimeout(() => {
          process.exit();
        }, 500);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      cli.on(CLI_EVENT_EXCEPTION, (message: string) => {
        setComponents((components: React.ReactNode[]) => [
          ...components,
          <SegmentSessionException key="exception" message={message} />,
        ]);

        setTimeout(() => {
          process.exit();
        }, 500);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.once("sign_client:session_approve_ok", () => {
        setComponents((components: React.ReactNode[]) => [
          ...components,
          <SegmentSessionDone key="session-done" />,
        ]);

        setTimeout(() => {
          process.exit();
        }, 500);
      });
    }
  }, [socket]);

  return <>{components}</>;
};

// @todo Disconnect.
export default class PairConnectCommand extends Command {
  static description = "Create a pair connection.";

  static examples = [`$ librt pair:connect --uri=<uri>`];

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
