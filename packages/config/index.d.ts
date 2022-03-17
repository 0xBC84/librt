export declare type Account = {
    name: string;
    network: string;
    mnemonic: string;
    node: string;
};
export declare type Config = {
    accounts: Account[];
};
export declare const getConfig: () => Config;
