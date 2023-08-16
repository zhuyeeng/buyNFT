const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers"); // use to redeploy the contract for faster testing to improve reliability.
const { expect } = require("chai");
const { ethers, deployments, getNamedAccounts } = require("hardhat");

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

    it("Should allow a buyer to purchase an NFT", async function () {
        const { secondContractAdd , seller, buyer, contract, SellContract } = await loadFixture(deployToken);

        //Set the price of the NFT
        const NFTprice = ethers.utils.parseEther("0.0001");
        const NFTprice2 = ethers.utils.parseEther("0.01");

        //Approve the NFT to the buy sell contract
        await contract.connect(seller).approve(secondContractAdd, 0);
        const total = await contract.totalSupply();

        //Approve the seller to sell NFT
        const approveSeller = await SellContract.approveSeller(0,seller.address);

        //List the NFT for sale
        await SellContract.connect(seller).listNFT(0, NFTprice);
        
        //Check NFT Details
        const NFTDetails = await SellContract.nftListings(0);
        console.log(NFTDetails);
        const percentages = await SellContract.royaltyPercentage();
        const buyerBalance = await buyer.getBalance();
        console.log(percentages)
        const availableBalance = ethers.utils.formatEther(buyerBalance);
        console.log("Buyer's Available Balance:", availableBalance);
        await SellContract.connect(buyer).buyNFT(0, { value: NFTprice2 });
    });
});