const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('NFT', () => {
  const NAME = 'Dapp Punks'
  const SYMBOL = 'DP'
  const COST = ether(10)
  const MAX_SUPPLY = 25
  const ALLOW_MINTING_ON = (Date.now()).toString().slice(0,10)
  const BASE_URI = 'ipfs://QmQ2jnDYecFhrf3asEWjyjZRX1pZSsNWG3qHzmNDvXa9qg/'
  
  let nft,
    deployer,
    minter
  
  beforeEach(async () => {
    const NFT = await ethers.getContractFactory('NFT')
    nft = await NFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI)
  
    let accounts = await ethers.getSigners()
    deployer = accounts[0]
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

  describe('Minting', () => {
    let transaction,
      result
    describe('Success', async () => {
      beforeEach(async () => {
        transaction = await nft.connect(minter).mint(1, {value: COST})
        result = await transaction.wait()
      })
      
      it('updates the total supply', async () => {
        expect(await nft.totalSupply()).to.equal(1)
      })
      it('updates the contract ether balance', async () => {
        expect(await ethers.provider.getBalance(nft.address)).to.equal(COST)
      })
    })
    describe('Failure', async () => {      
      it('rejects insufficient payment', async () => {
        const NFT = await ethers.getContractFactory('NFT')
        nft = await NFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI)
  
        await expect(nft.connect(minter).mint(1, {value: 1})).to.be.reverted
      })
      it('requires at least one token to be minted', async () => {
        const NFT = await ethers.getContractFactory('NFT')
        nft = await NFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI)
  
        await expect(nft.connect(minter).mint(0, {value: COST})).to.be.reverted
      })
      it('rejects early minting', async () => {
        const FUTURE_MINT_TIME = new Date("May 26, 2030 18:00:00").getTime().toString().slice(0,10)
        const NFT = await ethers.getContractFactory('NFT')
        nft = await NFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, FUTURE_MINT_TIME, BASE_URI)
  
        await expect(nft.connect(minter).mint(1, {value: COST})).to.be.reverted
      })
      it('does not allow maximum supply to be exceeded', async () => {
        const FUTURE_MINT_TIME = new Date("May 26, 2030 18:00:00").getTime().toString().slice(0,10)
        const NFT = await ethers.getContractFactory('NFT')
        nft = await NFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, FUTURE_MINT_TIME, BASE_URI)
  
        await expect(nft.connect(minter).mint(100, {value: COST * 100})).to.be.reverted
      })
    })
  })
})
