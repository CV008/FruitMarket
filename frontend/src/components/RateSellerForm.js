import React, { useState } from "react";
import { getContract } from "../utils/contract";

export default function RateSellerForm() {
  const [seller, setSeller] = useState("");
  const [rating, setRating] = useState("");

  const handleRate = async () => {
    const contract = await getContract();
    const tx = await contract.rateSeller(seller, parseInt(rating));
    await tx.wait();
    alert("Note envoyée !");
  };

  return (
    <div>
      <h3>Noter un vendeur</h3>
      <input placeholder="Adresse du vendeur" value={seller} onChange={e => setSeller(e.target.value)} />
      <input placeholder="Note (0 à 5)" value={rating} onChange={e => setRating(e.target.value)} />
      <button onClick={handleRate}>Envoyer</button>
    </div>
  );
}
