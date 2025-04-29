// src/components/NFTGallery.tsx
import React, { useEffect, useState } from "react";
import Image from "next/image";
import TransferNFT from "../components/Transfer";

// Static assets
const PLACEHOLDER_IMAGE = "/placeholder.png";

interface NFTMetadata {
  image?: string;
  name?: string;
  description?: string;
}

interface NFT {
  token_id: string;
  contract_address: string;
  metadata?: NFTMetadata;
}

const NFTImage: React.FC<{
  metadata?: NFTMetadata;
  tokenId: string;
}> = ({ metadata, tokenId }) => {
  const [imgSrc, setImgSrc] = useState(
    metadata?.image
      ? metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")
      : PLACEHOLDER_IMAGE
  );

  return (
    <Image
      src={imgSrc}
      alt={metadata?.name || `NFT ${tokenId}`}
      fill
      className="nft-image"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      onError={() => setImgSrc(PLACEHOLDER_IMAGE)}
      priority={false}
    />
  );
};

const NFTGallery: React.FC<{ account: string }> = ({ account }) => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);

  const refreshNFTs = () => {
    if (!account) return;
    setLoading(true);
    fetch(
      `https://testnet.explorer.etherlink.com/api/v2/addresses/${account}/nft`
    )
      .then((res) => res.json())
      .then((data) => setNfts(data?.items || []))
      .finally(() => setLoading(false));
  };

  useEffect(refreshNFTs, [account]);

  // --- Loading and Empty States ---
  if (loading)
    return <div className="p-4 text-center">Loading NFTs...</div>;
  if (!nfts.length)
    return (
      <div className="p-4 text-center">
        No NFTs found for this wallet.
      </div>
    );

  return (
    <>
      <div className="nft-grid">
        {nfts.map((nft) => (
          <article
            key={`${nft.token_id}-${nft.contract_address}`}
            className="nft-card"
            onClick={() => setSelectedTokenId(nft.token_id)}
            tabIndex={0}
            style={{ cursor: "pointer" }}
            aria-label={`Transfer NFT ${nft.metadata?.name || nft.token_id}`}
          >
            <div className="nft-media">
              <NFTImage metadata={nft.metadata} tokenId={nft.token_id} />
            </div>

            <div className="nft-details">
              <h3 className="nft-title text-truncate">
                {nft.metadata?.name || `Token #${nft.token_id}`}
              </h3>

              {nft.metadata?.description && (
                <p className="text-truncate">
                  {nft.metadata.description}
                </p>
              )}

              <div className="nft-collection text-truncate">
                {nft.contract_address}
              </div>
            </div>
          </article>
        ))}
      </div>

      {selectedTokenId && (
        <div className="modal-overlay" onClick={() => setSelectedTokenId(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Transfer NFT #{selectedTokenId}</h3>
            <TransferNFT
              account={account}
              tokenId={selectedTokenId}
              onTransferred={() => {
                setSelectedTokenId(null);
                refreshNFTs();
              }}
              onCancel={() => setSelectedTokenId(null)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default NFTGallery;
