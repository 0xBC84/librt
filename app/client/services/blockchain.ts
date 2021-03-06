import { isValidChainId } from "@walletconnect/utils";
import { Chain, getSupportedChainById } from "@librt/chain";
import { ethers } from "ethers";
import { getConfig } from "@librt/config";

type WalletProvider = ethers.Wallet | unknown;

export type Account = {
  node: string;
  wallet: WalletProvider;
  chain: Chain;
  name: string;
  id: string;
  network: string;
  protocol: string;
  address: string;
};

export const getEIP155WalletProvider = ({
  mnemonic,
  node,
  network,
}: {
  mnemonic: string;
  node: string;
  network: number | "localhost";
}) => {
  const _network = network === "localhost" ? undefined : network;
  const _provider = new ethers.providers.JsonRpcProvider(node, _network);
  return ethers.Wallet.fromMnemonic(mnemonic).connect(_provider);
};

export const getAccounts = (): Account[] => {
  const config = getConfig();
  const accounts: Account[] = [];

  for (const account of config.accounts || []) {
    // Only support eip155 networks.
    if (!account.network.startsWith("eip155")) continue;
    let chain;

    try {
      chain = getChainByWCId(account.network);
    } catch {
      // Fail silently.
      continue;
    }

    // Keeps compiler happy.
    if (!chain) continue;

    const wallet = getEIP155WalletProvider({
      mnemonic: account.mnemonic,
      node: account.node,
      network: chain.chainId,
    });

    accounts.push({
      wallet,
      chain,
      name: account.name,
      node: account.node,
      protocol: "eip155",
      network: chain.networkId.toString(),
      address: wallet.address,
      id: ["eip155", chain.chainId, wallet.address].join(":"),
    });
  }

  return accounts;
};

export const getChainByWCId = (chain: string) => {
  if (!isValidChainId(chain, false)) {
    throw new Error("invalid chain");
  }

  const [protocol, id] = chain.split(":");
  return getSupportedChainById(protocol, Number(id));
};
