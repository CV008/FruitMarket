import React, { useEffect } from "react";
import AddFruitForm from "./components/AddFruitForm";
import FruitList from "./components/FruitList";
import RateSellerForm from "./components/RateSellerForm";
function App() {
  const connectWallet = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } else {
      alert("Installez MetaMask !");
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div className="App">
      <h1>🍎 Fruit Marketplace</h1>
      <AddFruitForm />
      <FruitList />
      <RateSellerForm />
    </div>
  );
}

export default App;
