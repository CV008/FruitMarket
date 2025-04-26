import React, { useState, useEffect } from "react";
import { getContract } from "../utils/contract";
import { ethers } from "ethers";

export default function RateSellerForm() {
  const [seller, setSeller] = useState("");  // Pour l'adresse du vendeur
  const [rating, setRating] = useState("");  // Pour la note
  const [userAddress, setUserAddress] = useState("");  // Adresse de l'utilisateur connecté

  // Fonction pour vérifier si une adresse est valide
  const isValidAddress = (address) => {
    return ethers.isAddress(address);
  };

  // Fonction pour se connecter à MetaMask et obtenir l'adresse de l'utilisateur
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Demande à MetaMask de connecter un compte
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setUserAddress(accounts[0]);  // Définit l'adresse de l'utilisateur
      } catch (error) {
        console.error("Erreur de connexion MetaMask", error);
        alert("Erreur de connexion à MetaMask.");
      }
    } else {
      alert("MetaMask non détecté. Veuillez installer MetaMask.");
    }
  };

  // Fonction pour noter un vendeur
  const handleRate = async () => {
    if (!isValidAddress(seller)) {
      alert("Adresse du vendeur invalide.");
      return;
    }
    if (isNaN(rating) || rating < 0 || rating > 5) {
      alert("Veuillez entrer une note valide entre 0 et 5.");
      return;
    }

    try {
      const contract = await getContract();
      const tx = await contract.rateSeller(seller, parseInt(rating));
      await tx.wait();
      alert("Note envoyée !");
    } catch (error) {
      console.error("Erreur lors de l'envoi de la note:", error);
      alert("Erreur lors de l'envoi de la note. Veuillez vérifier vos informations.");
    }
  };

  useEffect(() => {
    // Essaie de se connecter à MetaMask dès que le composant est monté
    connectWallet();
  }, []);

  return (
    <div>
      <h3>Noter un vendeur</h3>
      {/* Affichage de l'adresse de l'utilisateur connecté */}
      <div>
        {userAddress && <p>Adresse connectée : {userAddress}</p>}
        {!userAddress && <button onClick={connectWallet}>Connecter MetaMask</button>}
      </div>

      {/* Entrée pour l'adresse du vendeur */}
      <input
        placeholder="Adresse du vendeur"
        value={seller}
        onChange={(e) => setSeller(e.target.value)}
      />
      {/* Entrée pour la note */}
      <input
        placeholder="Note (0 à 5)"
        type="number"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
      />
      <button onClick={handleRate}>Envoyer</button>
    </div>
  );
}
