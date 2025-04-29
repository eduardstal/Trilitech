'use client';
import { useState } from "react";
import WalletConnect from '../components/WalletConnect';
import NFTGallery from '../components/NFTGallery';

export default function HomePage() {
  const [account, setAccount] = useState<string | null>(null);

  return (
    <main>
      <h1>Trilitech Demo</h1>
      <WalletConnect onConnect={setAccount} />
      {account && <NFTGallery account={account} />}
    </main>
  );
}
