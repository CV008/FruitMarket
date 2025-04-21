import React, { useState } from "react";
import { getContract } from "../utils/contract";
import { ethers } from "ethers"; // ✅ Ajouté ici

export default function AddFruitForm() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const handleAdd = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.addFruit(name, ethers.parseEther(price));
      await tx.wait();
      alert("Fruit ajouté !");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h3>Ajouter un fruit</h3>
      <input placeholder="Nom" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Prix (ETH)" value={price} onChange={e => setPrice(e.target.value)} />
      <button onClick={handleAdd}>Ajouter</button>
    </div>
  );
}
