export declare type Chain = {
    name: string;
    title?: string;
    chain?: string;
    icon?: string;
    rpc: string[];
    faucets: string[];
    nativeCurrency?: {
        name?: string;
        symbol?: string;
        decimals?: number;
    };
    infoURL?: string;
    shortName?: string;
    chainId: number;
    networkId?: number;
    ens?: {
        registry?: string;
    };
    explorers?: {
        name?: string;
        url?: string;
        standard?: string;
    }[];
};
declare const CHAINS: Chain[];
export declare const getSupportedChainById: (protocol: string, id: number) => {
    name: string;
    chain: string;
    icon: string;
    rpc: string[];
    faucets: never[];
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    infoURL: string;
    shortName: string;
    chainId: number;
    networkId: number;
    slip44: number;
    ens: {
        registry: string;
    };
    explorers: {
        name: string;
        url: string;
        standard: string;
    }[];
    title?: undefined;
    parent?: undefined;
    network?: undefined;
} | {
    name: string;
    title: string;
    chain: string;
    rpc: string[];
    faucets: string[];
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    infoURL: string;
    shortName: string;
    chainId: number;
    networkId: number;
    ens: {
        registry: string;
    };
    explorers: {
        name: string;
        url: string;
        standard: string;
    }[];
    icon?: undefined;
    slip44?: undefined;
    parent?: undefined;
    network?: undefined;
} | {
    name: string;
    chain: string;
    rpc: string[];
    faucets: string[];
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    infoURL: string;
    shortName: string;
    chainId: number;
    networkId: number;
    explorers: {
        name: string;
        url: string;
        standard: string;
    }[];
    icon?: undefined;
    slip44?: undefined;
    ens?: undefined;
    title?: undefined;
    parent?: undefined;
    network?: undefined;
} | {
    name: string;
    chain: string;
    rpc: string[];
    faucets: string[];
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    infoURL: string;
    shortName: string;
    chainId: number;
    networkId: number;
    icon?: undefined;
    slip44?: undefined;
    ens?: undefined;
    explorers?: undefined;
    title?: undefined;
    parent?: undefined;
    network?: undefined;
} | {
    name: string;
    chain: string;
    icon: string;
    rpc: string[];
    faucets: string[];
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    infoURL: string;
    shortName: string;
    chainId: number;
    networkId: number;
    slip44?: undefined;
    ens?: undefined;
    explorers?: undefined;
    title?: undefined;
    parent?: undefined;
    network?: undefined;
} | {
    name: string;
    chain: string;
    rpc: string[];
    faucets: never[];
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    infoURL: string;
    shortName: string;
    chainId: number;
    networkId: number;
    explorers: {
        name: string;
        url: string;
        standard: string;
    }[];
    parent: {
        type: string;
        chain: string;
        bridges: {
            url: string;
        }[];
    };
    icon?: undefined;
    slip44?: undefined;
    ens?: undefined;
    title?: undefined;
    network?: undefined;
} | {
    name: string;
    chain: string;
    rpc: string[];
    faucets: string[];
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    infoURL: string;
    shortName: string;
    chainId: number;
    networkId: number;
    slip44: number;
    explorers: {
        name: string;
        url: string;
        standard: string;
    }[];
    icon?: undefined;
    ens?: undefined;
    title?: undefined;
    parent?: undefined;
    network?: undefined;
} | {
    name: string;
    title: string;
    chain: string;
    rpc: string[];
    faucets: string[];
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    explorers: {
        name: string;
        url: string;
        standard: string;
    }[];
    infoURL: string;
    shortName: string;
    chainId: number;
    networkId: number;
    icon?: undefined;
    slip44?: undefined;
    ens?: undefined;
    parent?: undefined;
    network?: undefined;
} | {
    name: string;
    chain: string;
    network: string;
    rpc: string[];
    faucets: string[];
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    infoURL: string;
    shortName: string;
    chainId: number;
    networkId: number;
    icon: string;
    explorers: {
        name: string;
        url: string;
        standard: string;
    }[];
    slip44?: undefined;
    ens?: undefined;
    title?: undefined;
    parent?: undefined;
} | {
    name: string;
    chain: string;
    rpc: string[];
    faucets: string[];
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    infoURL: string;
    shortName: string;
    chainId: number;
    networkId: number;
    slip44: number;
    icon?: undefined;
    ens?: undefined;
    explorers?: undefined;
    title?: undefined;
    parent?: undefined;
    network?: undefined;
} | {
    name: string;
    chain: string;
    icon: string;
    rpc: string[];
    faucets: never[];
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    infoURL: string;
    shortName: string;
    chainId: number;
    networkId: number;
    slip44: number;
    explorers: {
        name: string;
        url: string;
        standard: string;
    }[];
    ens?: undefined;
    title?: undefined;
    parent?: undefined;
    network?: undefined;
} | {
    name: string;
    chain: string;
    rpc: string[];
    faucets: never[];
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    infoURL: string;
    shortName: string;
    chainId: number;
    networkId: number;
    explorers: {
        name: string;
        url: string;
        standard: string;
    }[];
    parent: {
        chain: string;
        type: string;
        bridges?: undefined;
    };
    icon?: undefined;
    slip44?: undefined;
    ens?: undefined;
    title?: undefined;
    network?: undefined;
} | {
    name: string;
    chain: string;
    rpc: string[];
    faucets: string[];
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    infoURL: string;
    shortName: string;
    chainId: number;
    networkId: number;
    icon: string;
    explorers: {
        name: string;
        url: string;
        icon: string;
        standard: string;
    }[];
    slip44?: undefined;
    ens?: undefined;
    title?: undefined;
    parent?: undefined;
    network?: undefined;
} | {
    name: string;
    chain: string;
    network: string;
    icon: string;
    rpc: string[];
    faucets: string[];
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    infoURL: string;
    shortName: string;
    chainId: number;
    networkId: number;
    explorers: {
        name: string;
        url: string;
        icon: string;
        standard: string;
    }[];
    slip44?: undefined;
    ens?: undefined;
    title?: undefined;
    parent?: undefined;
} | {
    name: string;
    chain: string;
    network: string;
    icon: string;
    rpc: string[];
    faucets: string[];
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    infoURL: string;
    shortName: string;
    chainId: number;
    networkId: number;
    explorers: {
        name: string;
        url: string;
        icon: string;
        standard: string;
    }[];
    parent: {
        chain: string;
        type: string;
        bridges?: undefined;
    };
    slip44?: undefined;
    ens?: undefined;
    title?: undefined;
} | {
    name: string;
    chain: string;
    network: string;
    rpc: string[];
    faucets: never[];
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    infoURL: string;
    shortName: string;
    chainId: number;
    networkId: number;
    icon?: undefined;
    slip44?: undefined;
    ens?: undefined;
    explorers?: undefined;
    title?: undefined;
    parent?: undefined;
} | {
    name: string;
    chain: string;
    icon: string;
    rpc: string[];
    faucets: string[];
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    infoURL: string;
    shortName: string;
    chainId: number;
    networkId: number;
    explorers: {
        name: string;
        url: string;
        standard: string;
    }[];
    slip44?: undefined;
    ens?: undefined;
    title?: undefined;
    parent?: undefined;
    network?: undefined;
} | {
    name: string;
    chain: string;
    network: string;
    rpc: string[];
    faucets: string[];
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    infoURL: string;
    shortName: string;
    chainId: number;
    networkId: number;
    explorers: {
        name: string;
        url: string;
        standard: string;
    }[];
    icon?: undefined;
    slip44?: undefined;
    ens?: undefined;
    title?: undefined;
    parent?: undefined;
} | {
    name: string;
    title: string;
    chainId: number;
    shortName: string;
    chain: string;
    networkId: number;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    rpc: string[];
    faucets: string[];
    infoURL: string;
    explorers: {
        name: string;
        url: string;
        standard: string;
    }[];
    parent: {
        type: string;
        chain: string;
        bridges: {
            url: string;
        }[];
    };
    icon?: undefined;
    slip44?: undefined;
    ens?: undefined;
    network?: undefined;
} | undefined;
export default CHAINS;
