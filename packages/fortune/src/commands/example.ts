import WalletConnectClient, { CLIENT_EVENTS } from "@walletconnect/client";
import { Command } from "@oclif/core";
import chain from "@librt/chain";

export default class Example extends Command {
  static description = "Example.";

  static examples = [`$ fortune example`];

  static flags = {};

  static args = [];

  async run() {
    // @todo Get `projectId` from getConfig()
    const client = await WalletConnectClient.init({
      projectId: "004cbcf1b212d7e8786473c4cd8073cc",
      relayUrl: "wss://relay.walletconnect.com",
      metadata: {
        name: "librt",
        description: "",
        url: "#",
        icons: [],
      },
    });

    // @todo Use getConfig().
    const network: string | undefined = process.env.LIBRT_NETWORK;
    const node: string | undefined = process.env.LIBRT_NODE;
    if (!network) throw new Error("Network not configured");
    if (!node) throw new Error("Node not configured");

    // @todo Use getConfig().
    const chainData = chain.find((chain) => chain?.shortName === network);
    if (!chainData || !chainData.chainId) throw new Error("Network not found");

    // const provider = new EthereumProvider({
    //   client,
    //   chainId: chainData.chainId,
    //   rpc: {
    //     custom: {
    //       [chainData.chainId]: node,
    //     },
    //   },
    // });

    const session = client.connect({
      permissions: {
        blockchain: {
          chains: ["eip155:1"],
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

    client.on(CLIENT_EVENTS.pairing.proposal, async (proposal: any) => {
      const { uri } = proposal.signal.params;

      // eslint-disable-next-line no-console
      console.log(uri);
      this.exit(0);
    });

    await session;
  }
}
