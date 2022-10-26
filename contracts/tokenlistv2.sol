// SPDX-License-Identifier: dvdch.eth
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Tokenlist is Ownable {
   address[] list;
   function newToken(address _newToken) external onlyOwner {
      for (uint i = 0 ; i < list.length ; i++) {
         if (list[i] == _newToken) { revert("Already in list"); }
      }
      list.push(_newToken);
   }
   function deleteToken(address _badToken) external onlyOwner {
      for (uint i = 0 ; i < list.length ; i++) {
         if (list[i] == _badToken) {
               list[i] = list[list.length - 1];
               list.pop();
         }
      }
   }
   function callList() public view returns (address[] memory) {
      return list;
   }

   modifier isWhitelisted(address _token) {
      require((list.length > 0), "No list for now");
      bool _whitelisted = false;
      for (uint i = 0 ; i < list.length ; i++) {
         if ( _token == list[i]) {
               _whitelisted = true;
         }
      }
      require(_whitelisted);
      _;
   }
}