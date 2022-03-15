import { getConfig } from "@services/config";
import { isValidChainId } from "@walletconnect/utils";
import { Chain, getSupportedChainById } from "@librt/chain";
import { ethers } from "ethers";

type WalletProvider = ethers.Wallet | unknown;

export type Account = {
  node: string;
  wallet: WalletProvider;
  chain: Chain;
  name: string;
  id: string;
  address: string;
};

// @todo Rename to getEthAccount()
export const getWallet = () => {
  const { mneomic, node, network } = getConfig();
  const _network = network === "localhost" ? undefined : network;
  const _provider = new ethers.providers.JsonRpcProvider(node, _network);
  return ethers.Wallet.fromMnemonic(mneomic).connect(_provider);
};

// @todo Rename to getAccounts
// @todo Support multiple protocols and networks.
export const getWallets = (): Account[] => {
  const wallets: Account[] = [];
  const { node } = getConfig();
  const wallet = getWallet();

  let chain;
  try {
    // @todo Get chain ID from `network` (kovan => 42)
    chain = getChainByWCId("eip155:42");

    if (chain) {
      wallets.push({
        node,
        wallet,
        chain,
        name: "Account 1",
        id: ["eip155", chain.chainId, wallet.address].join(":"),
        address: wallet.address,
      });
    }
  } catch {
    // fail silently.
  }

  return wallets;
};

export const getChainByWCId = (chain: string) => {
  if (!isValidChainId(chain)) {
    throw new Error("invalid chain");
  }

  const [protocol, id] = chain.split(":");
  return getSupportedChainById(protocol, Number(id));
};
