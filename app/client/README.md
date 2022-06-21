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
$ npm install -g @librt/client
$ librt COMMAND
running command...
$ librt (--version)
@librt/client/0.0.1 linux-arm64 node-v16.15.0
$ librt --help [COMMAND]
USAGE
  $ librt COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`librt account:list`](#librt-accountlist)
* [`librt event:list`](#librt-eventlist)
* [`librt pair:connect`](#librt-pairconnect)

## `librt account:list`

```
USAGE
  $ librt account:list

EXAMPLES
  $ wallet account:list
```

## `librt event:list`

Create a pair connection.

```
USAGE
  $ librt event:list

DESCRIPTION
  Create a pair connection.

EXAMPLES
  $ librt event:list
```

## `librt pair:connect`

Create a pair connection.

```
USAGE
  $ librt pair:connect -u <value>

FLAGS
  -u, --uri=<value>  (required) Connection URI

DESCRIPTION
  Create a pair connection.

EXAMPLES
  $ librt pair:connect --uri=<uri>
```
<!-- commandsstop -->
