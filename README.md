# Token Bride UI

## Rationale
Interacting with smart contracts can be cucumbersome as you need to past the abis and contract addresses and have no validation of the inputs you are using.
Thats why we created a Dapp to improve the user experience when using the token bridge.


## Project setup

### Pre requisites
This project needs [node](https://nodejs.org/en/) 14 or higher and [yarn](https://yarnpkg.com/getting-started/install) installed

### Install dependencies
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Network configuration
Create an `.env` file in the project's root directory (e.g.: copy-pasting the existing `.env.example` file into a new `.env` file).
If we want to use RSK testnet as the main chain and Ethereum's Kovan as the side chain, our `.env` file would look like this:
```
VUE_APP_INFURA_KEY=YOUR_INFURA_KEY_HERE
VUE_APP_OFFLINE_DB=offline-db-name
VUE_APP_MAIN_CHAIN_ID=31
VUE_APP_SIDE_CHAIN_ID=42
VUE_APP_IS_MAINNET=false

#Just for executing e2e tests.
SECRET_WORDS=$$$12_WORDS_KEY_FOR_E2E_TEST$$$
CYPRESS_REMOTE_DEBUGGING_PORT=9222
```