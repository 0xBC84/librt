# @lbrts/wallet

LBRTS Wallet

<!-- toc -->
* [@lbrts/wallet](#lbrtswallet)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @lbrts/wallet
$ wallet COMMAND
running command...
$ wallet (--version)
@lbrts/wallet/0.0.1 linux-arm64 node-v16.14.0
$ wallet --help [COMMAND]
USAGE
  $ wallet COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`wallet balance`](#wallet-balance)
* [`wallet help [COMMAND]`](#wallet-help-command)

## `wallet balance`

Provides balance operations.

```
USAGE
  $ wallet balance

DESCRIPTION
  Provides balance operations.

EXAMPLES
  $ wallet balance
```

## `wallet help [COMMAND]`

Display help for wallet.

```
USAGE
  $ wallet help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for wallet.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.9/src/commands/help.ts)_
<!-- commandsstop -->
