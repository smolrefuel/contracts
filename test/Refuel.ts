import {
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers, network } from "hardhat";

const eth = (v:string|number)=>ethers.parseEther(typeof v === "number"?v.toString():v)

async function signRaw(signer: any, types: any, value: any, contract:string, chainIdHex:string) {
    const domain = {
        name: "SealedArtMarket",
        version: "1",
        chainId: chainIdHex,
        verifyingContract: contract
    };

    const signature = await signer.signTypedData(domain, types, value);
    const { r, s, v } = ethers.Signature.from(signature)
    return { ...value, r, s, v }
}

describe("Refuel", function () {
    async function deployFixture() {
        const [owner, seller, bot] = await ethers.getSigners();

        const CC = await ethers.getContractFactory("SmolRefuel");
        const ref = await CC.deploy(bot.address);

        const mockToken = await (await ethers.getContractFactory("MockToken")).deploy();
        mockToken.mint(seller.address, eth(10))

        const chainIdHex = await network.provider.send('eth_chainId');

        async function sign(signer: typeof owner, types: any, value: any, contract:string) {
            return signRaw(signer, types, value, contract, chainIdHex)
        }

        return { owner, seller, bot, mockToken, ref, sign};
    }

    it("basic flow", async function () {
        const { owner, seller, bot, mockToken, ref, sign } = await loadFixture(deployFixture);
        //const a = await ref.refuel(...[] as any)
    })

    it("pay", async function () {
        const { owner, seller, bot, mockToken, ref, sign } = await loadFixture(deployFixture);
        await mockToken.pay(await ref.getAddress(), { value: 10000000 })
        await owner.sendTransaction({
            to: await ref.getAddress(),
            value: 1000000000
        })
    })

    it("usdt", async function () {
        const { owner, bot, ref } = await loadFixture(deployFixture);
        const user = await ethers.getImpersonatedSigner("0x7ae3aea889bb78cecfa774f0c45edfeafde63fc9");
        await owner.sendTransaction({
            to: user.address,
            value: eth("4"),
        });
        const usdtContract = new ethers.Contract("0xdAC17F958D2ee523a2206206994597C13D831ec7", [
            "function approve(address _spender, uint _value) external",
            "function allowance(address _owner, address _spender) external constant returns (uint remaining)"
        ], user)
        await usdtContract.approve(await ref.getAddress(), "100000000000000000")
        console.log("allowance", await usdtContract.allowance(user.address, await ref.getAddress()))

        await ref.connect(bot).refuelWithoutPermit(
            "0xdAC17F958D2ee523a2206206994597C13D831ec7",
            user.address,
            "200000000",
            "0xDEF171Fe48CF0115B1d80b88dc8eAB59176FEe57",
            "0x0b86a4c1000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec7000000000000000000000000000000000000000000000000000000000bebc20000000000000000000000000000000000000000000000000000b08c3c546f6a2f000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000001000000000000000000004de506da0fd433c1a5d7a4faa01111c044910a184553",
            "0x216b4b4ba9f3e719726886d34a177484278bfcae",
            "24153409279791545"
        )
    })
})