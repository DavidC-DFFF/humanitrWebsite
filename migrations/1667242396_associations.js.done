module.exports = async function(deployer) {
   const Associations = artifacts.require("Associations");
 
   await deployer.deploy(Associations);
   const contract = await Associations.deployed();
 
   console.log("Contract address:", contract.address)
 };