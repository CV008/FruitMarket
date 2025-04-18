const FruitMarketplace = artifacts.require("FruitMarketplace");

contract("FruitMarketplace", (accounts) => {

    const seller = accounts[0];
    const buyer = accounts[1];
 
    it("Test 1- Deploiement smart contract", async () => {
      const instance = await FruitMarketplace.deployed();
      assert.notEqual(instance.address, 0x0, "Adresse du contrat invalide");
    });
 
    it("Test 2- Ajout de fruits", async () => {
      const instance = await FruitMarketplace.deployed();
      await instance.addFruit("Mangue", web3.utils.toWei("1", "ether"), {from : seller});
      const fruit = await instance.fruits(0);


      assert.equal(fruit.name, "Mangue", "Nom correct");
      assert.equal(fruit.price.toString(), web3.utils.toWei("1", "ether"), "Prix ok");
      assert.equal(fruit.seller, seller, "Vendeur exact");
    

      assert.notEqual(fruit.name, "bannne", "Nom incorrect");
      assert.notEqual(fruit.price.toString(), web3.utils.toWei("1.34", "ether"), "Prix anormal");
      assert.notEqual(fruit.seller, accounts[1], "Vendeur inexact");
    });

    it("Test 3: Acheter un fruit", async () => {
      const instance = await FruitMarketplace.deployed();
      const price = web3.utils.toWei("1", "ether");
  
      await instance.buyFruit(0, { from: buyer, value: price });
      const fruit = await instance.fruits(0);
  
      assert.notEqual(fruit.buyer, seller, "Acheteur incorrect");
      assert.notEqual(fruit.available, true, "Le fruit   devrait   être disponible");
   
      assert.equal(fruit.buyer, buyer, "Acheteur correct");
      assert.equal(fruit.available, false, "Le fruit ne devrait plus être disponible");
    });

    it("Test 4: Verification de disponibilite apres achat", async () => {
      const instance = await FruitMarketplace.deployed();
      const fruit = await instance.fruits(0);

      assert.equal(fruit.available, false, "Le fruit doit etre indisponible")
    });

  
/*  it("Test 5: Evaluation du vendeur", async () => {
      const instance = await FruitMarketplace.deployed();
      
      await FruitMarketplace.rateSeller(seller, 4, {from: buyer});
      assert.equal(rating.totalRating.toNumber(), 4, "Rate incorrecte");
      assert.equal(rating.numberOfRatings.toNumber(), 1, "Nombre evaluations incorrecte");
    });
*/
    it("Test 6: Update fruit", async () => {
      const instance = await FruitMarketplace.deployed();
      //ajout de fruit
      await instance.addFruit("Ananas", web3.utils.toWei("2", "ether"), { from: seller });

      //update du fruit[1]
      await instance.updateFruit(1, "Ananas update", web3.utils.toWei("3", "ether"), { from: seller });
    
      const fruit = await instance.fruits(1);
      assert.equal(fruit.name, "Ananas update", "LE nom du fruit n'a pas ete mis a jour");
      // assert.equal(fruit.price.toString(), web3.utils.toWei("12", "ether"), "LE prix du fruit n'a pas ete mis a jour");
      
    });

    it("Test 7: Fonds insuffissants", async () => {
      const instance = await FruitMarketplace.deployed();
       
      await instance.addFruit("Zaboka", web3.utils.toWei("6", "ether"), { from: seller });

      try {
        await instance.buyFruit(2, { from: buyer, value: web3.utils.toWei("1", "ether") });
        assert.fail("Achat non possible, cause d'insuffisance de fonds");
      } catch (error) {
        assert(error.message.includes("Not enough funds"), "Erreur attendue non levée");
      }
    
      const fruit = await instance.fruits(2);
      assert.equal(fruit.available, true, "Le fruit devrait rester disponible");
    });
    
    it("Test Bonus: Le vendeur ne peut pas acheter son propre fruit", async () => {
      const instance = await FruitMarketplace.deployed();
    
      // Ajouter un fruit par le seller
      await instance.addFruit("Papaye", web3.utils.toWei("1", "ether"), { from: seller });
    
      try {
        // Seller tente d'acheter son propre fruit (index 3)
        await instance.buyFruit(3, { from: seller, value: web3.utils.toWei("1", "ether") });
        assert.fail("Le vendeur ne devrait pas pouvoir acheter son propre fruit");
      } catch (error) {
        assert(error.message.includes("Seller cannot buy own fruit"), "Erreur attendue non levée");
      }
    
      const fruit = await instance.fruits(3);
      assert.equal(fruit.available, true, "Le fruit devrait rester disponible");
      assert.equal(fruit.buyer, "0x0000000000000000000000000000000000000000", "Il ne devrait pas y avoir d'acheteur");
    });
    
  });