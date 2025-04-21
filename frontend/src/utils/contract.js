import { ethers } from "ethers";
import FruitMarketplace from "../abi/FruitMarketplace.json";

// Remplace par l'adresse déployée de ton contrat
const CONTRACT_ADDRESS = "0xF81A85FCB514b7b72477f9AF76C4A7d34e8CaC70";

export const getContract = async () => {
    if (!window.ethereum) throw new Error("MetaMask non détecté");
  
    const provider = new ethers.BrowserProvider(window.ethereum); // v6
    const signer = await provider.getSigner(); // ✅ important !
    return new ethers.Contract(CONTRACT_ADDRESS, FruitMarketplace.abi, signer);
};
