import { getConfig } from "@services/config";
import { ethers } from "ethers";

export const getWallet = () => {
  const { mneomic, node, network } = getConfig();
  const _network = network === "localhost" ? undefined : network;
  const _provider = new ethers.providers.JsonRpcProvider(node, _network);
  return ethers.Wallet.fromMnemonic(mneomic).connect(_provider);
};
