// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EtherLinkNFT is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;

    constructor() 
        ERC721("EtherLink", "ELK")
        Ownable(msg.sender)
    {}

    function mint(address to, string memory _tokenURI) external onlyOwner returns (uint256) {
        uint256 tokenId = nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        return tokenId;
    }

    // Required override for ERC721URIStorage
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
