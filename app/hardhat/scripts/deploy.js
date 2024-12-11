// scripts/deploy.js
require("@nomiclabs/hardhat-ethers");
const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    // Compile the contracts
    await hre.run('compile');

    // Get the contract factory
    const Funds = await hre.ethers.getContractFactory("Funds");

    // Deploy the contract
    const funds = await Funds.deploy();

    // Wait for deployment to finish
    await funds.deployed();

    console.log("Funds deployed to:", funds.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });