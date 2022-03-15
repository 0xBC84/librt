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

// @todo Support multiple protocols and networks.
export const getWallets = () => {
  const wallets = [];
  const { node } = getConfig();
  const wallet = getWallet();

  let chain;
  try {
    // @todo Get chain ID from `network` (kovan => 42)
    chain = getChainByWCId("eip155:42");
  } catch {
    // fail silently.
  }

  // @todo Implement `accountName`.
  wallets.push({
    node,
    wallet,
    chain,
    accountName: "Account 1",
    address: wallet.address,
  });

  return wallets;
};

export const getChainByWCId = (chain: string) => {
  if (!isValidChainId(chain)) {
    throw new Error("invalid chain");
  }

  const [protocol, id] = chain.split(":");
  return getSupportedChainById(protocol, Number(id));
};
