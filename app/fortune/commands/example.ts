import { Command } from "@oclif/core";
import * as readline from "node:readline";
import { SignClient, SIGN_CLIENT_EVENTS } from "@walletconnect/sign-client";
import { SignClientTypes } from "@walletconnect/types/dist/cjs/sign-client/client";
// import readline from "node:readline";

export default class Example extends Command {
  static description = "Example.";

  static examples = [`$ fortune example`];

  static flags = {};

  static args = [];

  async run(): Promise<void> {
    readline.emitKeypressEvents(process.stdin);

    // @todo Get `projectId` from getConfig()
    const client = await SignClient.init({
      projectId: "004cbcf1b212d7e8786473c4cd8073cc",
      relayUrl: "ws://relay:5000",
      metadata: {
        name: "librt",
        description: "librt",
        url: "https://walletconnect.com/",
        icons: [],
      },
    });

    const { uri, approval } = await client.connect({
      requiredNamespaces: {
        eip155: {
          chains: ["eip155:42"],
          methods: [
            "eth_requestAccounts",
            "eth_accounts",
            "eth_chainId",
            "eth_sendTransaction",
            "eth_signTransaction",
            "eth_sign",
            "eth_signTypedData",
            "personal_sign",
          ],
          events: ["chainChanged", "accountsChanged"],
        },
      },
      relays: [{ protocol: "waku" }],
    });

    this.log(uri);
    const connection = await approval();

    this.log("connection approved, setting up handlers...");
    this.log("topic:", connection.topic);

    setInterval(() => {
      this.log("sending ping");
      client.ping({ topic: connection.topic });
    }, 2000);

    return new Promise(() => {
      client.on(SIGN_CLIENT_EVENTS.session_ping, () => {
        this.log("received ping");
      });

      client.on(SIGN_CLIENT_EVENTS.session_delete, () => {
        this.log("received disconnect");
        process.exit();
      });

      process.stdin.on("keypress", () => {
        this.log("press");
        process.exit();
      });
    });
  }
}
