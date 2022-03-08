# @librt/wallet

LIBRT Wallet

<!-- toc -->
* [@librt/wallet](#librtwallet)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @librt/wallet
$ librt-wallet COMMAND
running command...
$ librt-wallet (--version)
@librt/wallet/0.0.1 linux-arm64 node-v16.14.0
$ librt-wallet --help [COMMAND]
USAGE
  $ librt-wallet COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`librt-wallet balance`](#librt-wallet-balance)
* [`librt-wallet help [COMMAND]`](#librt-wallet-help-command)

## `librt-wallet balance`

Provides balance operations.

```
USAGE
  $ librt-wallet balance

DESCRIPTION
  Provides balance operations.

EXAMPLES
  $ wallet balance
```

## `librt-wallet help [COMMAND]`

Display help for librt-wallet.

```
USAGE
  $ librt-wallet help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for librt-wallet.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.9/src/commands/help.ts)_
<!-- commandsstop -->
