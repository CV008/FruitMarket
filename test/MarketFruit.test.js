const FruitMarketplace = artifacts.require("FruitMarketplace");

contract("FruitMarketplace", (accounts) => {
  const seller = accounts[0];
  const buyer = accounts[1];

  let instance;

  beforeEach(async () => {
    instance = await FruitMarketplace.new();
  });

  // ✅ Test 1 : Déploiement du contrat
  it("doit être déployé avec une adresse valide", async () => {
    assert(instance.address, "L'adresse du contrat est undefined");
    assert.notEqual(instance.address, "0x0", "L'adresse est 0x0");
  });

  // ✅ Test 2 : Ajouter une liste de fruits
  it("doit ajouter un fruit avec un nom et un prix", async () => {
    await instance.addFruit("Banane", web3.utils.toWei("1", "ether"), { from: seller });

    const fruit = await instance.fruits(0);
    assert.equal(fruit.name, "Banane");
    assert.equal(fruit.price, web3.utils.toWei("1", "ether"));
    assert.equal(fruit.seller, seller);
    assert.equal(fruit.available, true);
  });

  // ✅ Test 3 : Acheter un fruit
  it("doit permettre l'achat d'un fruit et enregistrer l'acheteur", async () => {
    await instance.addFruit("Pomme", web3.utils.toWei("1", "ether"), { from: seller });

    await instance.buyFruit(0, {
      from: buyer,
      value: web3.utils.toWei("1", "ether"),
    });

    const fruit = await instance.fruits(0);
    assert.equal(fruit.buyer, buyer);
    assert.equal(fruit.available, false);
  });

  // ✅ Test 4 : Vérification de la disponibilité après achat
  it("doit marquer le fruit comme indisponible après l'achat", async () => {
    await instance.addFruit("Mangue", web3.utils.toWei("1", "ether"), { from: seller });

    await instance.buyFruit(0, {
      from: buyer,
      value: web3.utils.toWei("1", "ether"),
    });

    const fruit = await instance.fruits(0);
    assert.equal(fruit.available, false);
  });

  // ✅ Test 5 : Évaluation du fournisseur
  it("doit permettre à un acheteur d'évaluer un fournisseur", async () => {
    await instance.rateSeller(seller, 4, { from: buyer });

    const rating = await instance.sellerRatings(seller);
    assert.equal(rating, 4);
  });

  // ✅ Test 6 : Mise à jour de la liste des fruits
  it("doit permettre au vendeur de mettre à jour les détails du fruit", async () => {
    await instance.addFruit("Orange", web3.utils.toWei("2", "ether"), { from: seller });

    await instance.updateFruit(0, "Orange douce", web3.utils.toWei("3", "ether"), {
      from: seller,
    });

    const fruit = await instance.fruits(0);
    assert.equal(fruit.name, "Orange douce");
    assert.equal(fruit.price, web3.utils.toWei("3", "ether"));
  });

  // ✅ Test 7 : Gestion des fonds insuffisants
  it("doit rejeter l'achat si les fonds sont insuffisants", async () => {
    await instance.addFruit("Ananas", web3.utils.toWei("2", "ether"), { from: seller });

    try {
      await instance.buyFruit(0, {
        from: buyer,
        value: web3.utils.toWei("1", "ether"), // Fonds insuffisants
      });
      assert.fail("La transaction aurait dû échouer");
    } catch (error) {
      assert.include(error.message, "Not enough funds", "Erreur attendue non détectée");
    }

    const fruit = await instance.fruits(0);
    assert.equal(fruit.available, true, "Le fruit ne devrait pas être vendu");
  });
});

