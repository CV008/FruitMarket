import React, { useEffect, useState } from "react";
import { getContract } from "../utils/contract";
import { ethers } from "ethers";

export default function FruitList() {
  const [fruits, setFruits] = useState([]);

  const fetchFruits = async () => {
    try {
      const contract = await getContract();
      console.log("Contract récupéré avec succès:", contract);
  
      const count = await contract.getFruitCount();
      console.log("Nombre de fruits:", count);
  
      const fruitArray = [];
      for (let i = 0; i < count; i++) {
        const fruit = await contract.getFruit(i);
        console.log(`Fruit ${i}:`, fruit);
        fruitArray.push({ index: i, ...fruit });
      }
  
      setFruits(fruitArray);
    } catch (err) {
      console.error("Erreur récupération fruits :", err);
    }
  };
  

  const handleBuy = async (index, price) => {
    try {
      const contract = await getContract();
      const tx = await contract.buyFruit(index, {
        value: price,
      });
      await tx.wait();
      alert("Fruit acheté !");
      fetchFruits();
    } catch (err) {
      console.error("Erreur achat :", err);
      alert("Échec de l'achat.");
    }
  };

  useEffect(() => {
    fetchFruits();
  }, []);

  return (
    <div>
      <h3>Liste des fruits</h3>
      {fruits.length === 0 ? (
        <p>Aucun fruit disponible.</p>
      ) : (
        fruits.map((fruit, index) => (
          <div key={index} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <p><strong>Nom:</strong> {fruit.name}</p>
            <p><strong>Prix:</strong> {ethers.formatEther(fruit.price)} ETH</p>
            <p><strong>Vendu ?</strong> {fruit.available ? "Non" : "Oui"}</p>
            {fruit.available && (
              <button onClick={() => handleBuy(fruit.index, fruit.price)}>
                Acheter
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
