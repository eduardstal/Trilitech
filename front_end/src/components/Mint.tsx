// src/components/MintNFT.tsx
import React, { useState } from "react";
import { ethers } from "ethers";
import ABI from "../abis/EtherLinkNFT.json";

const CONTRACT_ADDRESS = "0x933ab9068459F27F5B45b5fFd1A0d37C341Fb6e3";

interface MintNFTProps {
  account: string | null;
}

const MintNFT: React.FC<MintNFTProps> = ({ account }) => {
  const [minting, setMinting] = useState(false);
  const [message, setMessage] = useState("");

  const mintNFT = async () => {
    if (!window.ethereum || !account) {
      setMessage("Please connect your wallet first.");
      return;
    }
    setMinting(true);
    setMessage("");
    try {
      // Connect to the user's wallet
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Connect to the contract
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI.abi, signer);

      // Prepare your token URI (could be IPFS or any metadata URL)
      const tokenURI = "ipfs://your-token-metadata-uri"; // Replace with actual URI or make dynamic

      // Call the mint function (adjust name/params to your contract)
      const tx = await contract.mint(account, tokenURI);
      setMessage("Minting in progress...");

      // Wait for the transaction to be mined
      await tx.wait();
      setMessage("NFT minted successfully!");
    }catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error.message);
        } else {
          console.log("Unknown error");
        }
      } finally {
      setMinting(false);
    }
  };

  return (
    <div>
      <button onClick={mintNFT} disabled={minting || !account}>
        {minting ? "Minting..." : "Mint NFT"}
      </button>
      {message && <div>{message}</div>}
    </div>
  );
};

export default MintNFT;
