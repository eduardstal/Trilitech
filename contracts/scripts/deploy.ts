import { ethers } from "hardhat";

async function main() {
  const EtherLinkNFT = await ethers.getContractFactory("EtherLinkNFT");
  const nft = await EtherLinkNFT.deploy({
    gasLimit: 30_000_000,
  }); // No arguments needed
  await nft.waitForDeployment();
  console.log("Contract deployed to:", await nft.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
