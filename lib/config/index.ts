import config from "./config.json";

export type Account = {
  name: string;
  network: string;
  mnemonic: string;
  node: string;
};

export type Config = {
  storage: {
    uri: string;
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
  return config;
};