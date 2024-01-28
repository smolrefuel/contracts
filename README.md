## Scripts
```shell
REPORT_GAS=true npx hardhat test

export $(echo $(cat .env | sed 's/#.*//g'| xargs) | envsubst) && npx hardhat deploy --network mainnet
export $(echo $(cat .env | sed 's/#.*//g'| xargs) | envsubst) && npx hardhat etherscan-verify --network mainnet
```
