// src/components/TransferNFT.tsx
import React, { useState } from "react";
import { ethers } from "ethers";
import ABI from "../abis/EtherLinkNFT.json";

const CONTRACT_ADDRESS = "0x933ab9068459F27F5B45b5fFd1A0d37C341Fb6e3";

interface TransferNFTProps {
  account: string | null;
  tokenId: string;
  onTransferred?: () => void;
}

const TransferNFT: React.FC<TransferNFTProps> = ({ account, tokenId, onTransferred }) => {
  const [showModal, setShowModal] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [transferring, setTransferring] = useState(false);
  const [message, setMessage] = useState("");

  const handleTransfer = async () => {
    if (!window.ethereum || !account) {
      setMessage("Please connect your wallet first.");
      return;
    }
    if (!ethers.isAddress(recipient)) {
      setMessage("Please enter a valid Ethereum address.");
      return;
    }
    setTransferring(true);
    setMessage("");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI.abi, signer);

      // Call transferFrom(from, to, tokenId)
      const tx = await contract.transferFrom(account, recipient, tokenId);
      setMessage("Transfer in progress...");
      await tx.wait();
      setMessage("NFT transferred successfully!");
      setShowModal(false);
      setRecipient("");
      if (onTransferred) onTransferred();
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "Transfer failed");
    } finally {
      setTransferring(false);
    }
  };

  return (
    <>
      <button className="connect-button" onClick={() => setShowModal(true)}>
        Transfer
      </button>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Transfer NFT #{tokenId}</h3>
            <div className="form-group">
              <label htmlFor="recipient">Recipient Address</label>
              <input
                type="text"
                id="recipient"
                name="recipient"
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
                placeholder="0x..."
                autoFocus
              />
            </div>
            <div className="modal-actions">
              <button
                className="connect-button"
                onClick={handleTransfer}
                disabled={transferring}
              >
                {transferring ? "Transferring..." : "Confirm Transfer"}
              </button>
              <button
                className="connect-button text-button"
                onClick={() => setShowModal(false)}
                disabled={transferring}
              >
                Cancel
              </button>
            </div>
            {message && <div className="status-message">{message}</div>}
          </div>
        </div>
      )}
    </>
  );
};

export default TransferNFT;
