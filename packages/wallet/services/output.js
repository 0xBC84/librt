"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.value = exports.label = exports.getWriter = void 0;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const core_1 = require("@oclif/core");
const getWriter = (command) => {
    return {
        pending: (...args) => {
            const message = (0, chalk_1.default)(pending(), ...args);
            return {
                start: () => core_1.CliUx.ux.action.start(message),
                stop: () => core_1.CliUx.ux.action.stop(),
            };
        },
        success: (...args) => {
            return command.log((0, chalk_1.default)(success(), ...args));
        },
        error: (...args) => {
            return command.log((0, chalk_1.default)(error(), ...args));
        },
        warning: (...args) => {
            return command.log((0, chalk_1.default)(warning(), ...args));
        },
        write: (...args) => {
            return command.log((0, chalk_1.default)(...args));
        },
    };
};
exports.getWriter = getWriter;
const pending = () => {
    return chalk_1.default.reset.inverse.blueBright(" PENDING ");
};
const success = () => {
    return chalk_1.default.reset.inverse.greenBright(" SUCCESS ");
};
const error = () => {
    return chalk_1.default.reset.inverse.red(" ERROR ");
};
const warning = () => {
    return chalk_1.default.reset.inverse.yellowBright(" WARNING ");
};
const label = (...args) => {
    return chalk_1.default.grey(...args);
};
exports.label = label;
const value = (...args) => {
    return chalk_1.default.bold.white(...args);
};
exports.value = value;
