// SPDX-License-Identifier: dvdch.eth
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Whitelist is Ownable {
    struct asset {
        string name;
        address token;
        address aToken;
    }
    asset[] public Assets;

    constructor() {
        asset memory _asset;
        _asset.name = "USDC";
        _asset.token = 0xA2025B15a1757311bfD68cb14eaeFCc237AF5b43;
        _asset.aToken = 0x1Ee669290939f8a8864497Af3BC83728715265FF;
        Assets.push(_asset);
    }

    function declareAsset(
        string memory _name,
        address _token,
        address _aToken
    ) public onlyOwner {
        for (uint256 i = 0; i < Assets.length; i++) {
            if (Assets[i].token == _token) {
                revert("Asset already declared");
            }
        }
        asset memory _asset;
        _asset.name = _name;
        _asset.token = _token;
        _asset.aToken = _aToken;
        Assets.push(_asset);
    }

    function deleteAsset(address _token) public onlyOwner {
        for (uint256 i = 0; i < Assets.length; i++) {
            if (Assets[i].token == _token) {
                Assets[i] = Assets[Assets.length - 1];
                Assets.pop();
            }
        }
    }

    function getAssetListLength() public view returns (uint256) {
        return Assets.length;
    }

    function getAsset(uint256 _nb) public view returns (asset memory) {
        return Assets[_nb];
    }

    function getAssetAddress(uint256 _nb) public view returns (address) {
        return Assets[_nb].token;
    }

    function getAssetName(uint256 _nb) public view returns (string memory) {
        return Assets[_nb].name;
    }

    function getAaveAssetAddress(uint256 _nb) public view returns (address) {
        return Assets[_nb].aToken;
    }

    modifier isWhitelisted(address _token) {
        bool _whitelisted = false;
        for (uint256 i = 0 ; i < Assets.length; i++) {
            if (_token == Assets[i].token) {
                _whitelisted = true;
            }
        }
        require(_whitelisted);
        _;
    }
}
