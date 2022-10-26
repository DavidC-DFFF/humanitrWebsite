// SPDX-License-Identifier: dvdch.eth
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./tokenlistv2.sol";
import "./Forks/Masterchef.sol";

contract Vault is Ownable, Tokenlist {
   // [wallet][token] => quantity
   mapping(address => mapping(address => uint256)) Balances;
   //mapping(uint256 => address) assoWallets;
   address assoWallet = 0x54C470f15f3f34043BB58d3FBB85685B39E33ed8;

   MasterChef public chef;
   SushiToken public sushi;

   constructor(
      MasterChef _chef,
      SushiToken _sushi
   ) public {
      chef = _chef;
      sushi = _sushi;
   }

   function depositTokens(uint256 _amount, address _tokenAddress)
      external
      isWhitelisted(_tokenAddress)
   {
      ERC20(_tokenAddress).transferFrom(msg.sender, address(this), _amount);
      Balances[msg.sender][_tokenAddress] += _amount;
   }

   function depositAll(address _tokenAddress) external {
      uint256 _amount = ERC20(_tokenAddress).balanceOf(msg.sender);
      ERC20(_tokenAddress).transferFrom(msg.sender, address(this), _amount);
      Balances[msg.sender][_tokenAddress] += _amount;
   }

   function withdrawTokens(uint256 _amount, address _tokenAddress) external {
      require(
         _amount <= Balances[msg.sender][_tokenAddress],
         "Not enough funds"
      );
      ERC20(_tokenAddress).transfer(msg.sender, _amount);
      Balances[msg.sender][_tokenAddress] -= _amount;
   }

   function withdrawAll(address _tokenAddress) external {
      ERC20(_tokenAddress).transfer(
         msg.sender,
         Balances[msg.sender][_tokenAddress]
      );
      Balances[msg.sender][_tokenAddress] = 0;
   }

   function getWalletBalance(address _walletAddress, address _tokenAddress)
      public
      view
      returns (uint256)
   {
      return (Balances[_walletAddress][_tokenAddress]);
   }
}
