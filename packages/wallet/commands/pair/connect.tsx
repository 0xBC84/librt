import React, { useEffect, useState } from "react";
import { Command } from "@oclif/core";
import { Box, render, Text, useInput } from "ink";
import { Done, Indicator, Info, Layout } from "@librt/ui";
import EventEmitter from "node:events";

const accountList = [
  { address: "0x201...C33", tags: "Saving, Ethereum, Kovan" },
  { address: "0xBC1...A32", tags: "Saving, Ethereum, Kovan" },
];

const SessionApproval = ({
  onApproved,
  onDenied,
}: {
  onApproved: any;
  onDenied: any;
}) => {
  let isComplete = false;
  const [selected, setSelected] = useState(0);
  const [approved, setApproved] = useState<number[]>([]);

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
            <Text color="yellowBright">{account.address}</Text>
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

const SegmentPairProposal = ({ event }: { event: any }) => {
  const doPairProposal = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        event.emit("pairing.proposed");
        resolve(null);
      }, 2000);
    });
  };

  return (
    <Indicator
      label="attempting to pair"
      handler={doPairProposal}
      key="do-pair-proposal"
    />
  );
};

const SegmentSessionProposal = ({ event }: { event: any }) => {
  const doSessionProposal = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        event.emit("session.proposed");
        resolve(null);
      }, 2000);
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

const SegmentSessionReview = ({ event }: { event: any }) => {
  const doSessionReviewed = () => {
    event.emit("session.reviewed");
  };

  const doSessionDenied = () => {
    event.emit("session.denied");
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

const SegmentSessionApproval = ({ event }: { event: any }) => {
  const doSessionApproval = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        event.emit("session.approved");
        resolve(null);
      }, 2000);
    });
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

const event = new EventEmitter();

const PairConnect = () => {
  const [components, setComponents] = useState<any>([
    <SegmentPairProposal event={event} key="do-pair-proposal" />,
  ]);

  useEffect(() => {
    event.on("pairing.proposed", () => {
      setComponents((components: any) => [
        ...components,
        <SegmentSessionProposal event={event} key="do-session-proposal" />,
      ]);
    });
  }, []);

  useEffect(() => {
    event.on("session.proposed", () => {
      setComponents((components: any) => [
        ...components,
        <SegmentSessionReview key="do-session-reviewed" event={event} />,
      ]);
    });
  }, []);

  useEffect(() => {
    event.on("session.reviewed", () => {
      setComponents((components: any) => [
        ...components,
        <SegmentSessionApproval key="do-session-approval" event={event} />,
      ]);
    });
  }, []);

  useEffect(() => {
    event.on("session.approved", () => {
      setComponents((components: any) => [
        ...components,
        <SegmentSessionApproved key="session-approved" />,
      ]);

      setTimeout(() => {
        process.exit();
      }, 500);
    });
  }, []);

  useEffect(() => {
    event.on("session.denied", () => {
      setComponents((components: any) => [
        ...components,
        <SegmentSessionDenied key="session-denied" />,
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

  static examples = [`$ wallet pair:connect`];

  // @todo URI flag.
  static flags = {};

  static args = [];

  async run(): Promise<void> {
    render(
      <>
        <Layout>
          <PairConnect />
        </Layout>
      </>
    );
  }
}
