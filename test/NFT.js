const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('Token', () => {
  const NAME = 'Dapp Punks'
  const SYMBOL = 'DP'
  const COST = ether(10)
  const MAX_SUPPLY = 25
  const ALLOW_MINTING_ON = (Date.now() + 120000).toString().slice(0,10)
  const BASE_URI = 'ipfs://QmQ2jnDYecFhrf3asEWjyjZRX1pZSsNWG3qHzmNDvXa9qg/'
  
  let nft,
    deployer,
    minter
  
  beforeEach(async () => {
    const NFT = await ethers.getContractFactory('NFT')
    nft = await NFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI)
  
    let accounts = await ethers.getSigners()
    deployer = account[0]
    minter = accounts[1]


  })

  describe('Deployment', () => {
    it('has correct name', async () => {
      expect(await nft.name()).to.equal(NAME)
    })
    it('has correct symbol', async () => {
      expect(await nft.symbol()).to.equal(SYMBOL)
    })
    it('returns the cost to mint', async () => {
      expect(await nft.cost()).to.equal(COST)
    })
    it('returns the maximum total supply', async () => {
      expect(await nft.maxSupply()).to.equal(MAX_SUPPLY)
    })
    it('returns the allowed minting time', async () => {
      expect(await nft.allowMintingOn()).to.equal(ALLOW_MINTING_ON)
    })
    it('returns a base URI', async () => {
      expect(await nft.baseURI()).to.equal(BASE_URI)
    })
  })
})
