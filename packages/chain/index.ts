import data from "./chains.json"

export type Chain = {
  name?: string,
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
  chainId?: number,
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

const chains: Chain[] = data

export default chains
