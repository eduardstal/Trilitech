'use client';
import { MetaMaskProvider } from "@metamask/sdk-react";

export function Providers({ children }: { children: React.ReactNode }) {
  const sdkOptions = {
    dappMetadata: {
      name: "Trilitech Demo",
      url: "localhost",
    },
  };

  return <MetaMaskProvider sdkOptions={sdkOptions}>{children}</MetaMaskProvider>;
}
