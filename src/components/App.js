import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { ethers } from 'ethers'

// Components
import Navigation from './Navigation';
import Loading from './Loading';

// ABIs: Import your contract ABIs here
import NFT_ABI from '../abis/NFT.json';

// Config: Import your network config here
import config from '../config.json';
const NETWORK_ID = 31337;

function App() {
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)

  const [nft, setNFT] = useState(null)

  const [revealTime, setRevealTime] = useState(null)
  const [maxSupply, setMaxSupply] = useState(null)
  const [totalSupply, setTotalSupply] = useState(null)
  const [cost, setCost] = useState(null)
  const [balance, setBalance] = useState(null)

  const [isLoading, setIsLoading] = useState(true)

  const loadBlockchainData = async () => {
    // Initiate provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const nft = new ethers.Contract(config[NETWORK_ID].nft.address, NFT_ABI, provider)
    setNFT(nft)

    // Fetch accounts
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)

    const allowMintingOn = await nft.allowMintingOn()
    setRevealTime(allowMintingOn.toString() + '000');

    const maxSupply = await nft.maxSupply()
    const totalSupply = await nft.totalSupply()
    const cost = await nft.cost()
    const balance = await nft.balanceOf(account)

    setIsLoading(false)
  }

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData()
    }
  }, [isLoading]);

  return(
    <Container>
      <Navigation account={account} />

      <h1 className='my-4 text-center'>Dapp Punks</h1>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          
        </>
      )}
    </Container>
  )
}

export default App;
