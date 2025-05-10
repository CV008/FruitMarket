import React, { useState } from "react";
import AddFruitForm from "./AddFruitForm";
import FruitList from "./FruitList";

export default function FruitMarket() {
  const [refresh, setRefresh] = useState(false);

  const handleFruitAdded = () => {
    setRefresh((prev) => !prev);  // Forcer le rafraîchissement
  };

  return (
    <div>
      <h2>Marché des Fruits</h2>
      <AddFruitForm onFruitAdded={handleFruitAdded} />
      <FruitList refresh={refresh} />  {/* Passer 'refresh' à FruitList */}
    </div>
  );
}
