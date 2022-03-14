import React, { useEffect, useState } from "react";
import { Command, Flags } from "@oclif/core";
import { Box, render, Text, useInput } from "ink";
import { Done, Indicator, Info, Layout } from "@librt/ui";
import Client, { CLIENT_EVENTS } from "@walletconnect/client";
import WalletConnectClient from "@walletconnect/client";
import { getWallet } from "@services/ethers";
import { SessionTypes } from "@walletconnect/types";
import EventEmitter from "node:events";
import { truncateAddress } from "@services/common";

// @todo Implement multiple addresses
// @todo Tags
// @todo Handle errors

const SessionApproval = ({
  onApproved,
  onDenied,
}: {
  onApproved: any;
  onDenied: any;
}) => {
  let isComplete = false;
  const wallet = getWallet();
  const [selected, setSelected] = useState(0);
  const [approved, setApproved] = useState<number[]>([]);
  const accountList = [{ address: wallet.address, tags: "" }];

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
      if (approved.length > 0) onApproved();
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

const SessionInfo = () => {
  const labelWidth = 15;

  return (
    <Box flexDirection="column">
      <Box flexDirection="row">
        <Box minWidth={labelWidth}>
          <Text color="grey">name:</Text>
        </Box>
        <Box>
          <Text>Oasis</Text>
        </Box>
      </Box>
      <Box flexDirection="row">
        <Box minWidth={labelWidth}>
          <Text color="grey">URL:</Text>
        </Box>
        <Box>
          <Text>https://oasis.app</Text>
        </Box>
      </Box>
      <Box flexDirection="row">
        <Box minWidth={labelWidth}>
          <Text color="grey">blockchain:</Text>
        </Box>
        <Box>
          <Text>Ethereum</Text>
        </Box>
      </Box>
      <Box flexDirection="row">
        <Box minWidth={labelWidth}>
          <Text color="grey">relay:</Text>
        </Box>
        <Box>
          <Text>Waku</Text>
        </Box>
      </Box>
      <Box flexDirection="row">
        <Box minWidth={labelWidth}>
          <Text color="grey">methods:</Text>
        </Box>
        <Box flexDirection="column">
          <Text>eth_sendTransaction</Text>
          <Text>eth_signTransaction</Text>
          <Text>eth_sign</Text>
          <Text>personal_sign</Text>
          <Text>eth_signTypedData</Text>
        </Box>
      </Box>
    </Box>
  );
};

const SegmentPairProposal = ({
  client,
  uri,
}: {
  client?: Client | null;
  uri: string;
}) => {
  // @todo Handle error.
  const doPairProposal = () => {
    if (!client) {
      return new Promise((resolve) => {
        resolve(null);
      });
    }

    return client.pair({ uri });
  };

  return (
    <Indicator
      label="attempting to pair"
      handler={doPairProposal}
      key="do-pair-proposal"
    />
  );
};

const SegmentSessionProposal = ({ client }: { client: any }) => {
  const doSessionProposal = () => {
    return new Promise((resolve) => {
      client.on(CLIENT_EVENTS.session.proposal, () => {
        resolve(null);
      });
    });
  };

  return (
    <Indicator
      key="do-session-proposal"
      label="waiting for session proposals"
      handler={doSessionProposal}
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
  const doSessionReviewed = () => {
    cli.emit(CLI_EVENT_SESSION_REVIEW_APPROVED, proposal);
  };

  const doSessionDenied = () => {
    console.log("emit denied");
    cli.emit(CLI_EVENT_SESSION_REVIEW_DENIED, proposal);
  };

  return (
    <>
      <Text>
        <Info /> session proposed:
      </Text>
      <Box marginTop={1}>
        <SessionInfo />
      </Box>
      <Box marginTop={1} marginBottom={1}>
        <SessionApproval
          onApproved={doSessionReviewed}
          onDenied={doSessionDenied}
        />
      </Box>
    </>
  );
};

const SegmentSessionApproval = ({
  client,
  proposal,
}: {
  client: Client;
  proposal: SessionTypes.Proposal;
}) => {
  const wallet = getWallet();

  // @todo Build protcol and network dynamically.
  const response = {
    state: {
      accounts: ["eip155:42:" + wallet.address],
    },
  };

  const doSessionApproval = () => {
    return client.approve({ proposal, response });
  };

  return (
    <Box>
      <Indicator
        label="waiting for session approval"
        handler={doSessionApproval}
      />
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

const CLI_EVENT_SESSION_REVIEW_APPROVED = "session.review.approved";
const CLI_EVENT_SESSION_REVIEW_DENIED = "session.review.denied";
const cli = new EventEmitter();

const PairConnect = ({ uri }: { uri: string }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [components, setComponents] = useState<any>();

  useEffect(() => {
    WalletConnectClient.init({
      controller: true,
      projectId: "004cbcf1b212d7e8786473c4cd8073cc",
      relayUrl: "wss://relay.walletconnect.com",
      metadata: {
        name: "librt",
        description: "librt",
        url: "https://walletconnect.com/",
        icons: [],
      },
    }).then((client) => {
      setClient(client);
    });
  }, []);

  useEffect(() => {
    if (client) {
      setComponents([
        <SegmentPairProposal
          key="do-pair-proposal"
          client={client}
          uri={uri}
        />,
      ]);
    }
  }, [client, uri]);

  useEffect(() => {
    if (client) {
      client.on(CLIENT_EVENTS.pairing.created, () => {
        setComponents((components: any) => [
          ...components,
          <SegmentSessionProposal client={client} key="do-session-proposal" />,
        ]);
      });
    }
  }, [client]);

  useEffect(() => {
    if (client) {
      client.on(
        CLIENT_EVENTS.session.proposal,
        (proposal: SessionTypes.Proposal) => {
          setComponents((components: any) => [
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
  }, [client]);

  useEffect(() => {
    if (client) {
      cli.on(
        CLI_EVENT_SESSION_REVIEW_APPROVED,
        (proposal: SessionTypes.Proposal) => {
          setComponents((components: any) => [
            ...components,
            <SegmentSessionApproval
              key="do-session-approval"
              client={client}
              proposal={proposal}
            />,
          ]);
        }
      );
    }
  }, [client]);

  useEffect(() => {
    if (client) {
      client.on(CLIENT_EVENTS.session.created, () => {
        setComponents((components: any) => [
          ...components,
          <SegmentSessionApproved key="session-approved" />,
        ]);

        setTimeout(() => {
          process.exit();
        }, 500);
      });
    }
  }, [client]);

  useEffect(() => {
    if (client) {
      cli.on(CLI_EVENT_SESSION_REVIEW_DENIED, () => {
        setComponents((components: any) => [
          ...components,
          <SegmentSessionDenied key="session-denied" />,
        ]);

        setTimeout(() => {
          process.exit();
        }, 500);
      });
    }
  }, [client]);

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
