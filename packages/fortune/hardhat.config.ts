import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import { HardhatUserConfig } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types";

// @todo Use getConfig()
// @url https://github.com/amanusk/hardhat-template/blob/main/hardhat.config.ts
const account = (network: string): NetworkUserConfig | undefined => {
  const url: string | undefined = process.env.LIBRT_NODE;
  const mnemonic: string | undefined = process.env.LIBRT_MNEMONIC;

  if (!url || !mnemonic) {
    throw new Error("Network not configured");
  }

  return {
    url,
    accounts: {
      mnemonic,
    },
  };
};

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.8.9" }],
  },
  paths: {
    sources: "src/contracts",
  },
  typechain: {
    outDir: "types",
  },
  networks: {
    localhost: account("localhost"),
  },
  namedAccounts: {
    deployer: 0,
  },
};

export default config;
