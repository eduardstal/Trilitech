'use client';
import { useState } from "react";
import WalletConnect from '../components/WalletConnect';
import NFTGallery from '../components/NFTGallery';
import Image from "next/image";
import Link from 'next/link';

export default function Home() {

  const [account, setAccount] = useState<string | null>(null);

  return (
    <>
      <header className="site-header">
        <Link href="/" className="logo-link" aria-label="Etherlink Home">
          <Image
            src="/etherlink_logo.png"
            alt="Etherlink Logo"
            width={40}
            height={40}
            className="site-logo"
            priority
          />
        </Link>
      </header>
      <main className="app-container">
        <h1>Trilitech Demo</h1>
        <WalletConnect onConnect={setAccount} />
        {account && <NFTGallery account={account} />}
      </main>
    </>
  );
}
