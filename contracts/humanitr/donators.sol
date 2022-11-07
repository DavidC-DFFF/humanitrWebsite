// SPDX-License-Identifier: dvdch.eth
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Donators is Ownable {
    address public vault;
    address public migrator;
    struct profile {
        string name;
        mapping(address => mapping(address => uint256)) balance;
        //bool exists;
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
    }

    function updateDonatorName(string memory _name) public {
        //require(Donator[msg.sender].exists == true, "donator doesn't exist");
        Donator[msg.sender].name = _name;
    }

    function getDonatorAmounts(
        address _wallet,
        address _asso,
        address _asset
    ) public view returns (uint256) {
        /*if (!Donator[_wallet].exists) {
            return 0;
        } else {*/
            return Donator[_wallet].balance[_asso][_asset];
        //}
    }

    function getDonatorName(address _donator)
        public
        view
        returns (string memory)
    {
        return Donator[_donator].name;
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
