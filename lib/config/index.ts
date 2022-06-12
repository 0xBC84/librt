import config from "./config.json";
import path from "node:path";

export type Account = {
  name: string;
  network: string;
  mnemonic: string;
  node: string;
};

export type Config = {
  storage: {
    path: string;
  };
  accounts: Account[];
  wallet: {
    walletConnect: {
      projectId: string;
      relayUrl: string;
      metadata: {
        name: string;
        description: string;
        url: string;
        icons: string[];
      };
    };
  };
};

// @todo Config from persistent storage
// @todo Run object validation on config and run in command hook init
// @todo Validate account.mnemonic is valid
export const getConfig = (): Config => {
  const { storage, ...rest } = config as Config;
  const storagePath = storage.path.replace("$HOME", process.env.HOME || "");

  return {
    ...rest,
    storage: {
      ...storage,
      path: path.resolve(storagePath),
    },
  };
};
