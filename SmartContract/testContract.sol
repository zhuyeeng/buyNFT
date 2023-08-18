// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts@4.9.2/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.9.2/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts@4.9.2/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts@4.9.2/utils/Counters.sol";
import "@openzeppelin/contracts@4.9.2/access/Ownable.sol";



contract TestNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    uint256 MAX_SUPPLY = 1000;
    uint256 public royaltyPercentage;

    mapping(uint256 => Listing) public nftListings;

    struct Listing {
        address seller;
        uint256 price;
        bool isForSale;
    }

    constructor() ERC721("TestNFT", "TN") {}

    //Internal Function
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function safeMint(address to, string memory uri) public {

        uint256 tokenId = _tokenIdCounter.current();
        require(tokenId <= MAX_SUPPLY,"Sorry, All NFT have been minted");
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    //external function
    //The original owner of the NFT unable to get and need to store the orignal owner address, so that the royalty fee can transfer to the person.
    function buyNFT(uint256 tokenId) external payable {
        require(nftListings[tokenId].isForSale, "NFT is not for sale");
        Listing memory listing = nftListings[tokenId];
        address payable sellerAddress = payable(listing.seller);
        address payable originalOwner = payable(ownerOf(tokenId));
        uint256 price = listing.price;
        uint256 royaltyAmount = (price * royaltyPercentage) / 100;
        uint256 remainingAmount = price - royaltyAmount;

        require(msg.value >= price, "Insufficient funds sent");
        _transfer(sellerAddress, msg.sender, tokenId);

        // Transfer royalty fee to the original owner
        originalOwner.transfer(royaltyAmount);

        // Transfer remaining amount to the seller
        (bool success, ) = sellerAddress.call{value: remainingAmount}("");
        require(success, "Transfer failed");

        // Remove the NFT listing
        delete nftListings[tokenId];
    }

    function sellNFT(uint256 tokenId, uint256 price) external {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        nftListings[tokenId] = Listing({
            seller: msg.sender,
            price: price,
            isForSale: true
        });

        // Emit event for listing the NFT for sale
        emit NFTListedForSale(msg.sender, tokenId, price);
    }

    function cancelSale(uint256 tokenId) external {
        require(nftListings[tokenId].seller == msg.sender, "Not the seller");
        require(nftListings[tokenId].isForSale, "NFT is not listed for sale");

        // Remove the NFT listing
        delete nftListings[tokenId];

        // Transfer the NFT back to the seller
        _transfer(address(this), msg.sender, tokenId);
    }


    //The function that only owner can use
    function modifyTokenURI(uint256 tokenId, string memory newURI) public onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        _setTokenURI(tokenId, newURI);
    }

    function setRoyaltyPercentage(uint256 _percentage) external onlyOwner {
        royaltyPercentage = _percentage;
    }

    function withdrawBalance() external onlyOwner {
        address payable ownerAddress = payable(owner());
        ownerAddress.transfer(address(this).balance);
    }

    event NFTListedForSale(address indexed seller, uint256 tokenId, uint256 price);
}