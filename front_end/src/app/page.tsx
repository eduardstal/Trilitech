'use client';
import { useState } from "react";
import WalletConnect from '../components/WalletConnect';
import NFTGallery from '../components/NFTGallery';
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);

  return (
    <>
      <header className="site-header">
        <div className="header-left">
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
          <span className="site-title">EtherLink Demo</span>
        </div>
        <div className="header-right">
          <WalletConnect onConnect={setAccount} />
        </div>
      </header>
      <main className="app-container">
        {account && <NFTGallery account={account} />}
      </main>
    </>
  );
}
