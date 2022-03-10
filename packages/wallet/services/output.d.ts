import { Command } from "@oclif/core";
export declare const getWriter: (command: Command) => {
    pending: (...args: string[]) => {
        start: () => void;
        stop: () => void;
    };
    success: (...args: string[]) => void;
    error: (...args: string[]) => void;
    warning: (...args: string[]) => void;
    write: (...args: string[]) => void;
};
export declare const label: (...args: Array<string | number>) => string;
export declare const value: (...args: Array<string | number>) => string;
