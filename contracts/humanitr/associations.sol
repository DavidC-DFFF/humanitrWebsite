// SPDX-License-Identifier: dvdch.eth
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Associations is Ownable {
    struct asso {
        address wallet;
        string name;
    }
    asso[] public Assos;
    asso[] public OldAssos;
    constructor() {
        asso memory _asso;
        _asso.wallet = msg.sender;
        _asso.name = "Owner";
        Assos.push(_asso);
    }
    function declareAsso(address _wallet, string memory _name) public onlyOwner {
        for (uint i = 0 ; i < Assos.length ; i++) {
            if (Assos[i].wallet == _wallet) {
                revert("Asso already declared");
            }
        }
        asso memory _asso;
        _asso.wallet = _wallet;
        _asso.name = _name;
        for (uint i = 0 ; i < OldAssos.length ; i++) {
            if (OldAssos[i].wallet == _wallet) {
                _asso.wallet = OldAssos[i].wallet;
                _asso.name = OldAssos[i].name;
                OldAssos[i] = OldAssos[OldAssos.length - 1];
                OldAssos.pop();
            }
        }
        Assos.push(_asso);
    }
    function deleteAsso(address _wallet) public onlyOwner {
        for (uint i = 0 ; i < Assos.length ; i++) {
            if (Assos[i].wallet == _wallet) {
                OldAssos.push(Assos[i]);
                Assos[i] = Assos[Assos.length - 1];
                Assos.pop();
            }
        }
    }
    function getAssoListLength() public view returns(uint256) {
      return Assos.length;
    }
    function getAsso(uint256 _nb) public view returns (asso memory) {
        return Assos[_nb];
    }
    function getAssoWallet(uint256 _nb) public view returns (address) {
        return Assos[_nb].wallet;
    }
    function getAssoName(uint256 _nb) public view returns (string memory) {
        return Assos[_nb].name;
    }
}