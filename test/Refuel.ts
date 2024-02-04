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
})