import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;

    const { deployer } = await getNamedAccounts();

    await deploy('GasZipZip', {
        from: deployer,
        log: true,
        autoMine: true,
        args: ["0x9E22ebeC84c7e4C4bD6D4aE7FF6f4D436D6D8390"]
    });
};
module.exports = func;
func.tags = ['GasZipZip'];
