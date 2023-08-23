import { ethers } from 'ethers';
import { useEffect,useState } from 'react'; 
import nftBuySell from '../../data/abi/nftMintAbi.json';
import { nftContractAddress } from '../../config/setting';
import { useWallet } from '../../context/walletContext';


export default function useNftBuySell() {
    const { account } = useWallet();
    const [contract, setContract] = useState(null);
    useEffect(() => {
        if (window.ethereum && account) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const nftContract = new ethers.Contract(nftContractAddress, nftBuySell, signer);
            setContract(nftContract);
        } else {
            console.error('MetaMask extension not found or account not connected.');
            // console.log('error');
        }
    }, [account]);
}