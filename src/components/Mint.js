import {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner'
import { ethers } from 'ethers';

const Mint = ({provider, nft, cost, setIsLoading}) => {
	
	const [isWaiting, setIsWaiting] = useState(false)

	const mintHandler = async (e) => {
		e.preventDefault()
		setIsWaiting(true)
		try {
			const signer = await provider.getSigner()
			let transaction = await nft.connect(signer).mint(1, {value:cost})
			let result = transaction.wait()
		} catch (e) {
			window.alert(e)
		}

		setIsLoading(true)
	}

	return(
		<>
			{isWaiting ? (
				<Spinner animation='border' style={{display : 'block', margin: '0 auto'}}/>
			) : (
				<Form onSubmit={mintHandler} style={{maxWidth: '450px', margin: '50px auto'}}>
					<Form.Group>	
						<Button variant='primary' type='submit' style={{width: '100%'}}>Mint</Button>
					</Form.Group>
				</Form>
			)}
		</>
	);
}

export default Mint;
