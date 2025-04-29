import { BrowserProvider, JsonRpcSigner } from "ethers";
import type { WalletClient } from "viem";

export function walletClientToSigner(walletClient: WalletClient) {
  // Check for required properties
  if (!walletClient.chain) {
    throw new Error("WalletClient is missing chain information");
  }
  if (!walletClient.account) {
    throw new Error("WalletClient is missing account information");
  }

  // Destructure after validation
  const { account, chain, transport } = walletClient;

  // Create network configuration with safe defaults
  const network = {
    chainId: chain.id,
    name: chain.name || "unknown-chain",
    ensAddress: chain.contracts?.ensRegistry?.address,
  };

  // Create provider and signer
  const provider = new BrowserProvider(transport, network);
  return new JsonRpcSigner(provider, account.address);
}
