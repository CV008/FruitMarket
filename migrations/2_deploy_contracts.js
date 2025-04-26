const FruitMarketplace = artifacts.require("FruitMarketplace");

module.exports = function (deployer) {
  deployer.deploy(FruitMarketplace);
};