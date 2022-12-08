module.exports = async function(deployer) {
   const KRMPartnerNFT = artifacts.require("KRMPartnerNFT");
 
   await deployer.deploy(KRMPartnerNFT);
   const contract = await KRMPartnerNFT.deployed();
 
   console.log("KRMPartnerNFT contract address:", contract.address)
 };