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
@librt/wallet/0.0.1 linux-arm64 node-v16.15.0
$ librt-wallet --help [COMMAND]
USAGE
  $ librt-wallet COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`librt-wallet account:list`](#librt-wallet-accountlist)
* [`librt-wallet pair:connect`](#librt-wallet-pairconnect)

## `librt-wallet account:list`

```
USAGE
  $ librt-wallet account:list

EXAMPLES
  $ wallet account:list
```

## `librt-wallet pair:connect`

Create a pair connection.

```
USAGE
  $ librt-wallet pair:connect -u <value>

FLAGS
  -u, --uri=<value>  (required) Connection URI

DESCRIPTION
  Create a pair connection.

EXAMPLES
  $ wallet pair:connect --uri=<uri>
```
<!-- commandsstop -->
