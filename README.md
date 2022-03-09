LIBRT

## Usage

```
# Install and run.
docker-compose run --rm node yarn setup

# Build.
docker-compose run --rm node lerna run --stream build
docker-compose run --rm node lerna run --stream lint
docker-compose run --rm node lerna run --stream test
docker-compose run --rm node lerna run --stream dev
docker-compose run --rm node lerna run --stream deploy

# dApps.
docker-compose run --rm node librt-wallet

# Hardhat.
docker-compose up -d hardhat
```

## Local Environment

Run CLI against a local HardHat Ethereum network.

```
// .env
LIBRT_PROVIDER="http://hardhat:8545"
LIBRT_NETWORK="localhost"
```

```
docker-compose up hardhat
docker-compose run --rm node lm ...
```
