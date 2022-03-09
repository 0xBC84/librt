import { HardhatUserConfig } from "hardhat/config";

// @todo Use getConfig()
const mnemonic = () => {
  return process.env.LIBRT_MNEMOIC;
};

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      accounts: {
        mnemonic: mnemonic(),
      },
    },
  },
};

export default config;
