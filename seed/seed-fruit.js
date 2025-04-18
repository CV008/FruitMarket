const FruitMarket = artifacts.require("FruitMarketplace");

module.exports = async function (callback) {
  try {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0]; // celui qui va envoyer les transactions

    const instance = await FruitMarket.deployed();

    const fruits = [
      { name: "Pomme", price: web3.utils.toWei("0.01", "ether") },
      { name: "Banane", price: web3.utils.toWei("0.005", "ether") },
      { name: "Orange", price: web3.utils.toWei("0.008", "ether") },
      { name: "Mangue", price: web3.utils.toWei("0.02", "ether") },
      { name: "Ananas", price: web3.utils.toWei("0.03", "ether") }
    ];

    for (let fruit of fruits) {
      console.log(`Ajout de ${fruit.name} au prix de ${fruit.price} wei`);
      await instance.addFruit(fruit.name, fruit.price, { from: account });
    }

    console.log("✅ Fruits ajoutés avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors du seed :", error);
  }

  callback();
};
