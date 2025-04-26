import React, { useEffect, useState } from "react";
import { getContract } from "../utils/contract";
import { ethers } from "ethers";

export default function FruitList() {
  const [fruits, setFruits] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

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
        fruitArray.push({
          index: i,
          name: fruit[0],
          price: fruit[1],
          seller: fruit[2],
          available: fruit[3],
          buyer: fruit[4],
        });

      }


      setFruits(fruitArray);
    } catch (err) {
      console.error("Erreur récupération fruits :", err);
    }
  };


  const handleBuy = async (index, price) => {
    try {
      const contract = await getContract();

      console.log("Tentative d'achat du fruit :", index);
      console.log("Prix ETH brut :", price);

      const tx = await contract.buyFruit(index, {
        value: price, // ou convertis ici si nécessaire
      });

      await tx.wait();
      alert("Fruit acheté !");
      setTimeout(fetchFruits, 1000);
    } catch (err) {
      console.error("Erreur achat :", err);
      alert("Échec de l'achat.");
    }
  };

  const openEditDialog = (index, name, price) => {
    setEditIndex(index);
    setEditName(name);
    setEditPrice(ethers.formatEther(price)); // Pour afficher en ETH
    setEditMode(true);
  };

  const handleEditSubmit = async () => {
    try {
      const contract = await getContract();
      const priceInWei = ethers.parseEther(editPrice);

      const tx = await contract.updateFruit(editIndex, editName, priceInWei);
      await tx.wait();

      alert("Fruit modifié !");
      setEditMode(false);
      fetchFruits();
    } catch (err) {
      console.error("Erreur modification fruit :", err);
      alert("Erreur lors de la modification.");
    }
  };

  useEffect(() => {
    fetchFruits();
  }, []);


  return (
    <div>
      {editMode && (
              <div style={{ marginTop: "20px", padding: "20px", border: "2px solid blue", display: editMode ? "block" : "none" }}>
                <h4>Modifier le fruit</h4>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Nouveau nom"
                  style={{ marginRight: "10px" }}
                />
                <input
                  type="text"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  placeholder="Nouveau prix (ETH)"
                  style={{ marginRight: "10px" }}
                />
                <button onClick={handleEditSubmit} style={{ marginRight: "10px" }}>
                  Enregistrer
                </button>
                <button onClick={() => setEditMode(false)}>
                  Annuler
                </button>
              </div>
            )}
      <h3>Liste des fruits</h3>
      {fruits.length === 0 ? (
        <p>Aucun fruit disponible.</p>
      ) : (
        fruits.map((fruit, index) => (
          <div class="contain"> 


            <div key={index} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
              <p><strong>Nom:</strong> {fruit.name}</p>
              <p><strong>Prix:</strong> {fruit.price ? ethers.formatEther(fruit.price) + " ETH" : "N/A"}</p>
              <p><strong>Vendu ?</strong> {fruit.available ? "Non" : "Oui"}</p>
              {fruit.available && (
                <div>
                  <button style={{ margin: "10px" }} onClick={() => handleBuy(fruit.index, fruit.price)}>
                    Acheter
                  </button>
                  <button onClick={() => openEditDialog(fruit.index, fruit.name, fruit.price)} >
                    Éditer
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
