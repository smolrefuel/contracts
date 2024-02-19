## Scripts
```shell
REPORT_GAS=true npx hardhat test

export $(echo $(cat .env | sed 's/#.*//g'| xargs) | envsubst) && npx hardhat deploy --network mainnet
export $(echo $(cat .env | sed 's/#.*//g'| xargs) | envsubst) && npx hardhat etherscan-verify --network mainnet
```

## TODO
- Add support for DAI-like permits and other types