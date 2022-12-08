module.exports = async function(deployer) {
   const Karma = artifacts.require("Karma");
 
   await deployer.deploy(
    Karma, 
    "0xaBC98aa3A20039b5540b4cEC913eF8B7D50f8E74",
    "0xCd0E92f6f9Db77B19910a70aaCE7270D8061Ed38"
    );
   const contract = await Karma.deployed();
 
   console.log("Contract address:", contract.address)
 };