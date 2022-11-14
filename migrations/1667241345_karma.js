module.exports = async function(deployer) {
   const Karma = artifacts.require("Karma");
 
   await deployer.deploy(
    Karma, 
    "0x71b7baAf02a51EC4eE253c0aF62721A81C17C1b9",
    "0xCd0E92f6f9Db77B19910a70aaCE7270D8061Ed38"
    );
   const contract = await Karma.deployed();
 
   console.log("Contract address:", contract.address)
 };