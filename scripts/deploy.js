const hre = require("hardhat");

async function main() {
  const NAME = 'Dapp Punks'
  const SYMBOL = 'DP'
  const COST = ethers.utils.parseUnits('10', 'ether')
  const MAX_SUPPLY = 25
  const ALLOW_MINTING_ON = (Date.now() + 60000).toString().slice(0,10)
  const BASE_URI = 'ipfs://QmQ2jnDYecFhrf3asEWjyjZRX1pZSsNWG3qHzmNDvXa9qg/'
  
  const NFT = await ethers.getContractFactory('NFT')
  nft = await NFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI)

  await nft.deployed()
  console.log(`NFT deployed to: ${nft.address}\n`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
