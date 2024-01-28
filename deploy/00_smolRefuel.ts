import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;

    const { deployer } = await getNamedAccounts();

    await deploy('SmolRefuel', {
        from: deployer,
        log: true,
        autoMine: true,
        args: ["0xC618990A58638B9aDBaCC2Dcd342b9AfDc5e8864"]
    });
};
module.exports = func;
func.tags = ['SmolRefuel'];
