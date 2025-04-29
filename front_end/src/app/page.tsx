'use client';
import { useState, useEffect } from "react";
import { useAccount, useWalletClient } from "wagmi";
import WalletConnect from '../components/WalletConnect';
import NFTGallery from '../components/NFTGallery';
import MintNFT from '../components/Mint';
import Image from "next/image";
import Link from "next/link";
import { walletClientToSigner } from "../utils/ethersAdapter";
import type { JsonRpcSigner } from "ethers";

const CONTRACT_ADDRESS = "0x933ab9068459F27F5B45b5fFd1A0d37C341Fb6e3";

export default function Home() {
  const { address: account } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [signer, setSigner] = useState<JsonRpcSigner | undefined>(undefined);

  useEffect(() => {
    if (walletClient) {
      try {
        const _signer = walletClientToSigner(walletClient);
        setSigner(_signer);
      } catch (err) {
        setSigner(undefined);
        console.error("Failed to create signer from wallet client:", err);
      }
    } else {
      setSigner(undefined);
    }
  }, [walletClient]);

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
          <WalletConnect />
        </div>
      </header>
      <main className="app-container">
        {account && signer && (
          <>
            <MintNFT contractAddress={CONTRACT_ADDRESS} signer={signer} />
            <NFTGallery account={account} />
          </>
        )}
        {!account && (
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <p>Please connect your wallet to mint and view NFTs.</p>
          </div>
        )}
      </main>
    </>
  );
}
