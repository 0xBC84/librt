import data from "./chains.json"

export type Chain = {
  name: string,
  title?: string,
  chain?: string,
  icon?: string,
  rpc: string[],
  faucets: string[],
  nativeCurrency?: {
    name?: string,
    symbol?: string,
    decimals?: number
  },
  infoURL?: string,
  shortName?: string,
  chainId: number,
  networkId?: number,
  ens?: {
    registry?: string
  },
  explorers?: {
    name?: string,
    url?: string,
    standard?: string
  }[]
}

const CHAINS: Chain[] = data

const PROTOCOL_SUPPORTED = ["eip155"];

export const getSupportedChainById = (protocol: typeof PROTOCOL_SUPPORTED[number], id: number) => {
  if (!PROTOCOL_SUPPORTED.includes(protocol)) {
    throw new Error(`protocol \`${protocol}\` is not supported.`);
  }

  return data.find(chain => id === chain.chainId)
}

export default CHAINS
