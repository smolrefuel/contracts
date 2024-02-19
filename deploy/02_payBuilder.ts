import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;

    const { deployer } = await getNamedAccounts();

    await deploy('PayBuilder', {
        from: deployer,
        log: true,
        autoMine: true,
        args: []
    });
};
module.exports = func;
func.tags = ['PayBuilder'];
