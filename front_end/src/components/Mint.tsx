import { useState } from "react";
import { ethers } from "ethers";
import ERC721ABI from "../abis/ERC721.json";

interface MintProps {
  contractAddress: string;
  signer: ethers.Signer;
}

export default function Mint({ contractAddress, signer }: MintProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [minting, setMinting] = useState(false);

  const handleMint = async () => {
    setMinting(true);
    try {
      const contract = new ethers.Contract(
        contractAddress,
        ERC721ABI,
        signer
      );

      const metadata = {
        name,
        description,
        image: "https://google.com" // Your placeholder
      };

      const tx = await contract.mint(
        await signer.getAddress(),
        JSON.stringify(metadata)
      );
      
      await tx.wait();
      alert("NFT minted!");
    } catch (err) {
      console.error("Mint error:", err);
      alert("Minting failed");
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="mint-form">
      <input
        placeholder="NFT Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button 
        onClick={handleMint} 
        disabled={minting || !name || !description}
      >
        {minting ? "Minting..." : "Mint NFT"}
      </button>
    </div>
  );
}
