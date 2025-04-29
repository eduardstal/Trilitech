// src/components/MintNFT.tsx
import React, { useState } from "react";
import { ethers } from "ethers";
import ABI from "../abis/EtherLinkNFT.json";

const CONTRACT_ADDRESS = "0x933ab9068459F27F5B45b5fFd1A0d37C341Fb6e3";

interface MintNFTProps {
  account: string | null;
}

interface MintFormData {
  name: string;
  description: string;
  imageUrl: string;
}

const MintNFT: React.FC<MintNFTProps> = ({ account }) => {
  const [minting, setMinting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<MintFormData>({
    name: "",
    description: "",
    imageUrl: ""
  });
  const [message, setMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const mintNFT = async () => {
    if (!window.ethereum || !account) {
      setMessage("Please connect your wallet first.");
      return;
    }
    
    try {
      setMinting(true);
      setMessage("");
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI.abi, signer);

      // Construct metadata URI (simplified example)
      const metadata = {
        name: formData.name,
        description: formData.description,
        image: formData.imageUrl
      };
      
      // In production, upload to IPFS here
      const tokenURI = JSON.stringify(metadata);

      const tx = await contract.mint(account, tokenURI);
      setMessage("Minting in progress...");
      await tx.wait();
      setMessage("NFT minted successfully!");
      setShowModal(false);
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "Minting failed");
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="header-center">
      <button 
        className="connect-button" 
        onClick={() => setShowModal(true)}
        disabled={minting}
      >
        {minting ? "Minting..." : "Create NFT"}
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create New NFT</h3>
            
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="imageUrl">Image URL</label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="modal-actions">
              <button
                className="connect-button"
                onClick={mintNFT}
                disabled={minting}
              >
                Confirm Mint
              </button>
              <button
                className="connect-button text-button"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {message && <div className="status-message">{message}</div>}
    </div>
  );
};

export default MintNFT;
