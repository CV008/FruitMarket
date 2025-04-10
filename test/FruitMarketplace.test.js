const FruitMarketplace = artifacts.require("FruitMarketplace");

contract("FruitMarketplace", (accounts) => {
    it("should deploy successfully", async () => {
      const instance = await FruitMarketplace.deployed();
      assert.notEqual(instance.address, null, "Contract address should not be null");
      assert.notEqual(instance.address, "", "Contract address should not be empty");
    });
  });