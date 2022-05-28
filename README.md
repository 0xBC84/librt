LIBRT

## Usage

```
# Install and run.
docker-compose run --rm node pnpm install

# Build.
docker-compose run --rm node pnpm run build
docker-compose run --rm node pnpm run lint
docker-compose run --rm node pnpm run test
docker-compose run --rm node pnpm run dev
docker-compose run --rm node pnpm run deploy

# Hardhat.
docker-compose up -d hardhat

# WC Relay.
docker-compose up -d relay
```

## Local Environment

Run CLI against a local HardHat Ethereum network.

```
// .env
LIBRT_NODE="http://hardhat:8545"
LIBRT_NETWORK="localhost"
```

```
docker-compose up hardhat
docker-compose run --rm node librt...
```
