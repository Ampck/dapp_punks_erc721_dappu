import { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Countdown from 'react-countdown';
import { ethers } from 'ethers'

// Components
import Navigation from './Navigation';
import Data from './Data';
import Mint from './Mint';
import Loading from './Loading';


// ABIs: Import your contract ABIs here
import NFT_ABI from '../abis/NFT.json';

import preview from '../preview.png';

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
  const [walletOf, setWalletOf] = useState(null)
  const [baseURI, setBaseURI] = useState(null)
  const [lastToken, setLastToken] = useState(null)

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
    setMaxSupply(maxSupply)
    const totalSupply = await nft.totalSupply()
    setTotalSupply(totalSupply)
    const cost = await nft.cost()
    setCost(cost)
    const balance = await nft.balanceOf(account)
    setBalance(balance)
    const walletOf = await nft.walletOf(account)
    setWalletOf(walletOf)
    const baseURI = await nft.baseURI()
    setBaseURI(baseURI)
    if (balance > 0) {
      const lastToken = await nft.tokenOfOwnerByIndex(account, balance-1)  
      setLastToken(lastToken)
    }

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
          <Row>
            <Col>
              {balance > 0 ? (
                <div className='text-center'>
                  <img
                    src={`https://ipfs.io/ipfs/QmQPEMsfd1tJnqYPbnTQCjoa8vczfsV1FmqZWgRdNQ7z3g/${lastToken}.png`}
                    alt="Open Punk"
                    width='400px'
                    height='400px'
                  />
                </div>
              ) : (
                <img src={preview} alt=""/>
              )}
            </Col>
            <Col>
              <div className="my-4 text-center">
                <Countdown date={parseInt(revealTime)} className='h2'/>
              </div>
              <Data
                maxSupply={maxSupply}
                totalSupply={totalSupply}
                cost={cost}
                balance={balance}
              />
              <Mint
                provider={provider}
                nft={nft}
                cost={cost}
                setIsLoading={setIsLoading}
              />
            </Col>
          </Row>
        </>
      )}
    </Container>
  )
}

export default App;
