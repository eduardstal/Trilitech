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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {nfts.map(nft => (
        <div 
          key={`${nft.token_id}-${nft.contract_address}`}
          className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
        >
          {nft.metadata?.image && (
            <div className="relative aspect-square">
              <Image
                src={nft.metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                alt={nft.metadata.name || `NFT ${nft.token_id}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
          <div className="p-4 bg-white dark:bg-gray-800">
            <h3 className="font-semibold truncate">
              {nft.metadata?.name || `Token #${nft.token_id}`}
            </h3>
            {nft.metadata?.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                {nft.metadata.description}
              </p>
            )}
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 truncate">
              Collection: {nft.contract_address}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NFTGallery;




//fetch(`https://testnet.explorer.etherlink.com/api/v2/addresses/${account}/nft`)
//fetch(`https://testnet.explorer.etherlink.com/api/v2/addresses/0x272a166BE93DA4c2a91123AB7b3a504D637A363c/nft`)
