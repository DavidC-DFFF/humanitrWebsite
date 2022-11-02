module.exports = async function(deployer) {
  const Whitelist = artifacts.require("Whitelist");

  await deployer.deploy(
     Whitelist);
  const contract = await Whitelist.deployed();

  console.log("Contract address:", contract.address)
};