import { ethers } from 'ethers';

const Data = ({maxSupply, totalSupply, cost, balance}) => {
	return(
		<div className='text-center'>
			<p><strong>Available to Mint: </strong>{maxSupply - totalSupply}</p>
			<p><strong>Cost to Mint: </strong>{ethers.utils.formatUnits(cost, 'ether')} ETH</p>
			<p><strong>User Balance: </strong>{balance.toString()}</p>
		</div>
	);
}

export default Data;
