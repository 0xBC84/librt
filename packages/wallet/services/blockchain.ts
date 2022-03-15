import { getConfig } from "@services/config";
import { isValidChainId } from "@walletconnect/utils";
import { getSupportedChainById } from "@librt/chain";
import { ethers } from "ethers";

export const getWallet = () => {
  const { mneomic, node, network } = getConfig();
  const _network = network === "localhost" ? undefined : network;
  const _provider = new ethers.providers.JsonRpcProvider(node, _network);
  return ethers.Wallet.fromMnemonic(mneomic).connect(_provider);
};

export const getChainByWCId = (chain: string) => {
  if (!isValidChainId(chain)) {
    throw new Error("invalid chain");
  }

  const [protocol, id] = chain.split(":");
  return getSupportedChainById(protocol, Number(id));
};
