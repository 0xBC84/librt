LIBRT

## Usage

```
# Install and run.
cp .env.example .env
edit .env
docker-compose run --rm node pnpm install

# Start wallet.
docker-compose up node

# Pair with dApp.
./.bin/run client cli:dev pair:connect --uri='wc:...'
```

## Notes

- [dApp Example](https://react-app.walletconnect.com/)
- [Wallet Example](https://react-wallet.walletconnect.com/)
