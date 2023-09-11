// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./ERC721Enumerable.sol";
import "./Ownable.sol";

contract NFT is ERC721Enumerable, Ownable {
	uint256 public cost;
	uint256 public maxSupply;
	uint256 public allowMintingOn;
	string public baseURI;

	constructor(
		string memory _name,
		string memory _symbol,
		uint256 _cost,
		uint256 _maxSupply,
		uint256 _allowMintingOn,
		string memory _baseURI
	) ERC721(_name, _symbol) {
		cost = _cost;
		maxSupply = _maxSupply;
		allowMintingOn = _allowMintingOn;
		baseURI = _baseURI;
	}
    
}