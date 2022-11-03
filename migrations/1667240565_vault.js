module.exports = async function (deployer) {
   const Vault = artifacts.require("Vault");

   await deployer.deploy(
      Vault, 
      "0xd7673d9e4f97FbBFE6B04a3b9eEE3e8520A6842F", 
      "0x3c75f343228d0637C1ee9c71664535001Dd03DFA", 
      "0x7D88900f025397a2E396A8887315c42b21020D62",
      "0x89223Cbdf55CD439d660c5620d38E70292E0b26E");
   const contract = await Vault.deployed();

   console.log("Contract address:", contract.address)
};