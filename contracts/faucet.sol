// SPDX-License-Identifier: None
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Faucet is Ownable {
    
    function refill(address _tokenAddress, uint _amount) external onlyOwner {
        ERC20(_tokenAddress).transferFrom(msg.sender, address(this), _amount);
    }

    function withdraw(address _tokenAddress, uint _amount) external onlyOwner {
        require(_amount < ERC20(_tokenAddress).balanceOf(msg.sender));
        ERC20(_tokenAddress).transfer(msg.sender, _amount);
    }

    function claim(address _tokenAddress) external {
        require((ERC20(_tokenAddress).balanceOf(msg.sender) < 100) || (msg.sender == owner()), "Max 100 on wallet to claim more");
        ERC20(_tokenAddress).transfer(msg.sender, (100*10**18));
    }
}