import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import { HardhatUserConfig } from "hardhat/config";

// @todo Use getConfig()
const mnemonic = () => {
  return process.env.LIBRT_MNEMONIC;
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
