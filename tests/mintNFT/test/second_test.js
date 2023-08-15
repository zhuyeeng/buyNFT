const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers"); // use to redeploy the contract for faster testing to improve reliability.
const { expect } = require("chai");

        

describe("Buy Sell NFT Contract", function(){
    async function deployToken(){
        const [owner, seller, buyer] = await ethers.getSigners();
        const uri = "https://ipfs.filebase.io/ipfs/QmR53eKpCo87CewvRkY6EwkssvMc7ppNZNVEJNnGe9CNbX"
        const defaultRoyaltyFees = ethers.utils.parseUnits('5');
        const MintNFT = await ethers.getContractFactory("TestNFT");
        const SellNFT= await ethers.getContractFactory("NFTMarketplace");
        const contract = await MintNFT.deploy();
        const MasterAdd = await contract.address;
        await contract.connect(owner).safeMint(seller.address, uri);
        const SellContract = await SellNFT.deploy(MasterAdd, defaultRoyaltyFees);
        const secondContractAdd = await SellContract.address;

        return {secondContractAdd, SellContract, owner, seller, buyer, contract, uri};
    };

    it("Approve the NFT to the second contract to sell", async function(){
        const { seller, contract, secondContractAdd } = await deployToken();
        await contract.connect(seller).approve(secondContractAdd, 0);
    });

    it("List NFT for sell", async function(){
        const { seller, SellContract } = await deployToken();
        const NFTprice = 0.00001;
        const priceInWei = ethers.utils.parseUnits(NFTprice.toString());
        await SellContract.connect(seller).listNFT(0, priceInWei);
        const NFTDetail = await SellContract.nftListings(0);
        console.log(NFTDetail);
    });

    it("Buy NFT", async function(){
        const { seller, buyer, SellContract } = await deployToken();
        const buyerBalance = await buyer.getBalance();
        const availableBalance = ethers.utils.formatEther(buyerBalance);
        console.log("Buyer's Available Balance:", availableBalance);

        await SellContract.connect(buyer).buyNFT(0, { value: buyerBalance });
        // await SellContract.connect(buyer).buyNFT(0,{ value: ethers.utils.parseUnits("1000000000000000000")});
    })
});