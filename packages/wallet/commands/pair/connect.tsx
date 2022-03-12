import React, { useState } from "react";
import { Command } from "@oclif/core";
import { Box, render, Text } from "ink";
import { Done, Indicator, Info, Layout } from "@librt/ui";

const SessionApproval = () => {
  return (
    <>
      <Box flexDirection="column">
        <Box flexDirection="row">
          <Box minWidth={2}>
            <Text color="yellowBright">•</Text>
          </Box>
          <Text color="yellowBright">[-] </Text>
          <Text color="yellowBright">0x201...C33 </Text>
          <Text color="grey">Saving, Ethereum, Kovan</Text>
        </Box>
        <Box flexDirection="row">
          <Box minWidth={2} />
          <Text color="yellow">[ ] </Text>
          <Text color="yellow">0xBC1...A32 </Text>
          <Text color="grey">Saving, Ethereum, Kovan</Text>
        </Box>
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

const PairConnect = () => {
  const [pair, setPair] = useState(false);
  const [session, setSession] = useState(false);
  const [approval, setApproval] = useState(false);

  const handlePairProposal = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setPair(true);
        resolve(null);
      }, 2000);
    });
  };

  const handleSessionProposal = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setSession(true);
        resolve(null);
      }, 2000);
    });
  };

  const handleSessionApproval = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setApproval(true);
        resolve(null);
      }, 2000);
    });
  };

  return (
    <>
      <Indicator label="attempting to pair" handler={handlePairProposal} />
      {pair && (
        <Indicator
          label="waiting for session proposal"
          handler={handleSessionProposal}
        />
      )}
      {session && (
        <>
          <Text>
            <Info /> session proposed:
          </Text>
          <Box marginTop={1}>
            <SessionInfo />
          </Box>
          <Box marginTop={1} marginBottom={1}>
            <SessionApproval />
          </Box>
          <Box>
            <Indicator
              label="waiting for session proposal"
              handler={handleSessionApproval}
            />
          </Box>
        </>
      )}
      {approval && (
        <Box>
          <Text>
            <Done /> session created
          </Text>
        </Box>
      )}
    </>
  );
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
