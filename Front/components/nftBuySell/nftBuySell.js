import { ethers } from 'ethers';
import { useEffect,useState } from 'react'; 
import nftBuySell from '../../data/abi/nftMintAbi.json';
import { nftContractAddress } from '../../config/setting';
import { useWallet } from '../../context/walletContext';

export default function useNftBuySell() {
    const { account, balance } = useWallet();
    const [ contract, setContract ] = useState(null);
    useEffect(() => {
        if (window.ethereum && account) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(nftContractAddress, nftBuySell, signer);
            setContract(contract);
        } else {
            console.error('MetaMask extension not found or account not connected.');
        }
    }, [account]);

    const buyFunction = (price) => {
        if (!contract) {
            console.error("Contract is not initialized");
            return null;
        }
        const valueToSend = ethers.utils.parseEther(price); 
        return contract.buyNFT({ value: valueToSend, gasLimit: 100000 });
    };
}