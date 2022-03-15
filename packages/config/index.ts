import config from "./config.json";

export type Account = {
  name: string;
  network: string;
  mnemonic: string;
  node: string;
};

export type Config = {
  accounts: Account[];
};

// @todo Config from persistent storage
export const getConfig = (): Config => {
  return config;
};
