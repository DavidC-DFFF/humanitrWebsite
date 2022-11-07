// SPDX-License-Identifier: dvdch.eth
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Donators is Ownable {
   address public vault;
   address public migrator;
   address[] public donatorsList;
   mapping(address => uint256) totalDonation;
   struct profile {
      string name;
      mapping(address => mapping(address => uint256)) balance;
   }
   mapping(address => profile) public Donator;

   constructor(address _vault, address _migrator) {
      vault = _vault;
      migrator = _migrator;
   }

   function setVault(address _vault) public onlyOwner {
      vault = _vault;
   }

   function setMigrator(address _migrator) public onlyOwner {
      migrator = _migrator;
   }

   function updateDonatorMigrate(
      string memory _name,
      uint256 _amount,
      address _asset,
      address _assoWallet,
      address _userWallet
   ) public onlyMigrator {
      Donator[_userWallet].balance[_assoWallet][_asset] += _amount;
      Donator[_userWallet].name = _name;
   }

   function updateDonator(
      uint256 _amount,
      address _asset,
      address _assoWallet,
      address _userWallet
   ) public onlyVault {
      Donator[_userWallet].balance[_assoWallet][_asset] += _amount;
      for (uint256 i ; i < donatorsList.length; i++) {
         if (donatorsList[i] == _userWallet) {
            return;
         }
      }
      donatorsList.push(_userWallet);
      totalDonation[_asset] += _amount;
   }
   
   function getDonation(address _asset) public view returns(uint256) {
      return totalDonation[_asset];
   }

   function updateDonatorName(string memory _name) public {
      Donator[msg.sender].name = _name;
   }

   function getDonatorAmounts(
      address _wallet,
      address _asso,
      address _asset
   ) public view returns (uint256) {
      return Donator[_wallet].balance[_asso][_asset];
   }

   function getDonatorName(address _donator)
      public
      view
      returns (string memory)
   {
      return Donator[_donator].name;
   }

    
   function getDonatorsList() public view returns (address[] memory) {
      return donatorsList;
   }

   modifier onlyVault() {
      require(msg.sender == vault, "Only vault can do that - Donators");
      _;
   }
   modifier onlyMigrator() {
      require(msg.sender == migrator, "Only migrator can do that - Donators");
      _;
   }
}