LBRTS

## Usage

```
# Install and run.
docker-compose run --rm node yarn setup

# Build.
docker-compose run --rm node lerna run build
docker-compose run --rm node lerna run lint
docker-compose run --rm node lerna run test
docker-compose run --rm node lerna run dev
docker-compose run --rm node lerna run --stream deploy
```

## Local Environment

Run CLI against a local HardHat Ethereum network.

```
// .env
LIBERTAS_PROVIDER="http://hardhat:8545"
LIBERTAS_NETWORK="localhost"
```

```
docker-compose up hardhat
docker-compose run --rm node lm ...
```
