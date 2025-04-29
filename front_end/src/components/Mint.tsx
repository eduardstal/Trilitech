import React, { useState } from "react";
import { ethers } from "ethers";
import ERC721ABI from "../abis/ERC721.json";

interface MintNFTProps {
  contractAddress: string;
  signer: ethers.Signer;
}

export default function MintNFT({ contractAddress, signer }: MintNFTProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [minting, setMinting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0] ?? null; // Fix: Convert undefined → null
    setFile(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleMint = async () => {
    setMinting(true);
    try {
        if (file){
            console.log("Minting with File:", file.name);
        }
      const imageUrl = imagePreview || "https://google.com";
      const metadata = { name, description, image: imageUrl };
      const tokenURI = JSON.stringify(metadata);

      const contract = new ethers.Contract(contractAddress, ERC721ABI, signer);
      const tx = await contract.mint(await signer.getAddress(), tokenURI);
      await tx.wait();

      alert("NFT minted!");
      setName("");
      setDescription("");
      setFile(null);
      setImagePreview(null);
    } catch (err) {
      console.error("Minting failed:", err);
      alert("Minting failed. See console for details.");
    } finally {
      setMinting(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>Mint NFT</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "block", marginBottom: 12 }}
      />
      {imagePreview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img 
          src={imagePreview} 
          alt="NFT Preview" 
          style={{ maxWidth: 200, marginBottom: 12 }}
        />
      )}
      <input
        placeholder="NFT Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ display: "block", marginBottom: 12, width: "100%" }}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ display: "block", marginBottom: 12, width: "100%" }}
      />
      <button onClick={handleMint} disabled={minting || !name || !description}>
        {minting ? "Minting..." : "Mint NFT"}
      </button>
    </div>
  );
}
