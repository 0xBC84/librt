import { Command, Flags } from "@oclif/core";
import WalletConnectClient, { CLIENT_EVENTS } from "@walletconnect/client";
import { SessionTypes } from "@walletconnect/types";
import { getWallet } from "@services/blockchain";

export default class Pair extends Command {
  static description = "Create connection pair.";

  static examples = [`$ wallet pair`];

  static flags = {
    uri: Flags.string({
      char: "u",
      description: "Connection URI",
      required: true,
    }),
  };

  static args = [];

  async run(): Promise<void> {
    const { flags } = await this.parse(Pair);
    const wallet = getWallet();

    const client = await WalletConnectClient.init({
      controller: true,
      projectId: "004cbcf1b212d7e8786473c4cd8073cc",
      relayUrl: "wss://relay.walletconnect.com",
      metadata: {
        name: "librt",
        description: "librt",
        url: "https://walletconnect.com/",
        icons: [],
      },
    });

    client.pair({ uri: flags.uri });

    return new Promise(() => {
      client.on(
        CLIENT_EVENTS.session.proposal,
        async (proposal: SessionTypes.Proposal) => {
          this.log("session proposed");
          this.log(JSON.stringify(proposal, null, "  "));

          // @todo Build protcol and network dynamically.
          const response = {
            state: {
              accounts: ["eip155:42:" + wallet.address],
            },
          };

          client.approve({ proposal, response });

          // @todo Exit somehow
          setTimeout(() => {
            process.exit();
          }, 1000);
        }
      );
    });
  }
}
