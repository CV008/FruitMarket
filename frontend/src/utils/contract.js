import { ethers } from "ethers";
import FruitMarketplace from "../abi/FruitMarketplace.json";

// Remplace par l'adresse déployée de ton contrat
const CONTRACT_ADDRESS = "0xA66045d70F1872E84f22b66D69462992aCC847Ce";

export const getContract = async () => {
    if (!window.ethereum) throw new Error("MetaMask non détecté");
  
    const provider = new ethers.BrowserProvider(window.ethereum); // v6
    const signer = await provider.getSigner(); // ✅ important !
    return new ethers.Contract(CONTRACT_ADDRESS, FruitMarketplace.abi, signer);
};
