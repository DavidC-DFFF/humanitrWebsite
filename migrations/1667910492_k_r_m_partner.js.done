module.exports = async function(deployer) {
  const KRMPartner = artifacts.require("KRMPartner");

  await deployer.deploy(KRMPartner);
  const contract = await KRMPartner.deployed();

  console.log("KRMPartner contract address:", contract.address)
};