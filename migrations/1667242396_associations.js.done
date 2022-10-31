module.exports = async function(deployer) {
   const Associations = artifacts.require("Associations");
 
   await deployer.deploy(Associations, "0x14B059c26a99a4dB9d1240B97D7bCEb7C5a7eE13");
   const contract = await Associations.deployed();
 
   console.log("Contract address:", contract.address)
 };