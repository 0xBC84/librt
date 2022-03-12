import WalletConnectClient, { CLIENT_EVENTS } from "@walletconnect/client";
import { PairingTypes } from "@walletconnect/types";
import { Command } from "@oclif/core";
import readline from "node:readline";

export default class Example extends Command {
  static description = "Example.";

  static examples = [`$ fortune example`];

  static flags = {};

  static args = [];

  async run(): Promise<void> {
    readline.emitKeypressEvents(process.stdin);

    // @todo Get `projectId` from getConfig()
    const client = await WalletConnectClient.init({
      projectId: "004cbcf1b212d7e8786473c4cd8073cc",
      relayUrl: "wss://relay.walletconnect.com",
      metadata: {
        name: "librt",
        description: "librt",
        url: "https://walletconnect.com/",
        icons: [],
      },
    });

    const createSession = (pairing?: { topic: string }) => {
      client.connect({
        pairing,
        permissions: {
          blockchain: {
            chains: ["eip155:42"],
          },
          jsonrpc: {
            methods: [
              "eth_sendTransaction",
              "personal_sign",
              "eth_signTypedData",
            ],
          },
        },
      });
    };

    createSession();

    return new Promise(() => {
      client.on(
        CLIENT_EVENTS.pairing.proposal,
        async (proposal: PairingTypes.Proposal) => {
          this.log("pairing proposed");
          this.log(JSON.stringify(proposal, null, "  "));
        }
      );

      client.on(
        CLIENT_EVENTS.pairing.created,
        async (proposal: PairingTypes.Created) => {
          this.log("pairing created");
          this.log(JSON.stringify(proposal, null, "  "));
          // const pairing = { topic: proposal.topic };
          // createSession(pairing);
        }
      );

      client.on(CLIENT_EVENTS.session.created, () => {
        process.exit();
      });

      process.stdin.on("keypress", () => {
        // eslint-disable-next-line no-console
        console.log("press");
        process.exit();
      });
    });
  }
}
