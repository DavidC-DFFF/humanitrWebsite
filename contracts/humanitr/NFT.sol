// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KRMPartner is ERC721, Ownable {
    constructor() ERC721("KRMPartner", "KPRTNR") {}

    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }
}

_validRecipient(address to, address from) private view returns (bool) {         // e.g. return myNftContract.ownerOf(tokenId) == to;     }