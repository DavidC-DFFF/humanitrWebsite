module.exports = async function(deployer) {
   const Donators = artifacts.require("Donators");
 
   await deployer.deploy(
      Donators, 
      "0x04Be176aA8781738FB9EdF4d6694aAa82097811f", 
      "0x989cD1Fe6cC17cf51cAE97389A884b88b46F8eaf");
   const contract = await Donators.deployed();
 
   console.log("Contract address:", contract.address)
 };