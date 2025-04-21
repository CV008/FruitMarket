import { ethers } from "ethers";
import FruitMarketplace from "../abi/FruitMarketplace.json";

// Remplace par l'adresse déployée de ton contrat
const CONTRACT_ADDRESS = "0x23a5365113d26dc5Aec935839CD5A3590D58f284";

export const getContract = async () => {
    if (!window.ethereum) throw new Error("MetaMask non détecté");
  
    const provider = new ethers.BrowserProvider(window.ethereum); // v6
    const signer = await provider.getSigner(); // ✅ important !
    return new ethers.Contract(CONTRACT_ADDRESS, FruitMarketplace.abi, signer);
};
