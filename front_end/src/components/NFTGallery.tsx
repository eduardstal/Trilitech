import React, { useEffect, useState } from "react";
import Image from 'next/image';

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

const NFTGallery: React.FC<{ account: string }> = ({ account }) => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!account) return;
    
    setLoading(true);
    const fetchURL = `https://testnet.explorer.etherlink.com/api/v2/addresses/0x272a166BE93DA4c2a91123AB7b3a504D637A363c/nft`;
    
    fetch(fetchURL)
      .then(res => res.json())
      .then(data => {
        setNfts(data.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [account]);

  if (loading) return <div className="p-4 text-center">Loading NFTs...</div>;
  if (!nfts.length) return <div className="p-4 text-center">No NFTs found for this wallet.</div>;

  return (
    <div className="nft-grid">
      {nfts.map(nft => (
        <article 
          key={`${nft.token_id}-${nft.contract_address}`}
          className="nft-card"
        >
          {nft.metadata?.image && (
            <div className="nft-media">
              <Image
                src={nft.metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                alt={nft.metadata.name || `NFT ${nft.token_id}`}
                fill
                className="nft-image"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
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
  );
};

export default NFTGallery;




//fetch(`https://testnet.explorer.etherlink.com/api/v2/addresses/${account}/nft`)
//fetch(`https://testnet.explorer.etherlink.com/api/v2/addresses/0x272a166BE93DA4c2a91123AB7b3a504D637A363c/nft`)
