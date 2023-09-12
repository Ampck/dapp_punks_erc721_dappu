// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./ERC721Enumerable.sol";
import "./Ownable.sol";
import "./Strings.sol";

contract NFT is ERC721Enumerable, Ownable {
	using Strings for uint256;

	uint256 public cost;
	uint256 public maxSupply;
	uint256 public allowMintingOn;
	string public baseURI;

	event Mint(
		uint256 amount,
		address minter
	);
	event Withdraw(
		uint256 amount,
		address owner
	);
	event PriceChanged(
		uint256 newCost
	);

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

	function mint(uint256 _mintAmount)
		public
		payable
	{
		require(block.timestamp >= allowMintingOn,
			"Minting not open...");
		require(_mintAmount > 0,
			"Must mint at least 1 token...");
		require(msg.value >= cost * _mintAmount,
			"Not enough ETH sent with transaction...");	
		
		uint256 supply = totalSupply();
		require(supply + _mintAmount <= maxSupply,
			"Maximum token supply exceeded...");

		for(uint256 i = 1; i <= _mintAmount; i++) {
			_safeMint(msg.sender, supply + i);
		}

		emit Mint(_mintAmount, msg.sender);
	}

	function tokenURI(uint256 _tokenId)
		public
		view
		virtual
		override
		returns(string memory)
	{
		require(_exists(_tokenId), "Token does not exist...");
		return(string(abi.encodePacked(baseURI, _tokenId.toString(), '.json')));
	}

	function walletOf(address _owner)
		public
		view
		returns(uint256[] memory)
	{
		uint256 ownerTokenCount = balanceOf(_owner);
		uint256[] memory tokenIds = new uint256[](ownerTokenCount);
		for(uint256 i; i < ownerTokenCount; i++) {
			tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
		}
		return(tokenIds);
	}
    
    function withdraw()
    	public
    	onlyOwner
    {
    	uint256 balance = address(this).balance;
    	(bool success, ) = payable(msg.sender).call{value: balance}("");
    	require(success, "Call Failed...");
    	emit Withdraw(balance, msg.sender);
    }

    function setCost(uint256 _newCost)
    	public
    	onlyOwner
	{
		cost = _newCost;
		emit PriceChanged(_newCost);
	}

}