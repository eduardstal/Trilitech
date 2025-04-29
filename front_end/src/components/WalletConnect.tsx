import React, { useEffect, useState, useCallback } from "react";

// Define the WalletConnect component props interface
interface WalletConnectProps {
  onConnect?: (address: string) => void;
  onChainChanged?: (chainId: string) => void;
}

// Define the EIP-1193 provider interface with proper typing
// Using techniques from the viem library implementation and the official EIP-1193 spec
interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  
  // Define the event emitter methods with proper typing for each event
  on(event: 'accountsChanged', listener: (accounts: string[]) => void): void;
  on(event: 'chainChanged', listener: (chainId: string) => void): void;
  on(event: 'connect', listener: (connectInfo: { chainId: string }) => void): void;
  on(event: 'disconnect', listener: (error: { code: number; message: string }) => void): void;
  on(event: string, listener: (...args: unknown[]) => void): void;
  
  // Define the event removal methods with the same typing
  removeListener(event: 'accountsChanged', listener: (accounts: string[]) => void): void;
  removeListener(event: 'chainChanged', listener: (chainId: string) => void): void;
  removeListener(event: 'connect', listener: (connectInfo: { chainId: string }) => void): void;
  removeListener(event: 'disconnect', listener: (error: { code: number; message: string }) => void): void;
  removeListener(event: string, listener: (...args: unknown[]) => void): void;
  
  isMetaMask?: boolean;
  isConnected?: () => boolean;
}

// Define window.ethereum global type
declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect, onChainChanged }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);
  const [chainId, setChainId] = useState<string | null>(null);

  // Get the Ethereum provider
  const getEthereum = (): EthereumProvider | undefined => {
    if (typeof window === "undefined") return undefined;
    return window.ethereum;
  };

  // Check if wallet is already connected
  const checkConnection = useCallback(async () => {
    const ethereum = getEthereum();
    if (!ethereum) return;

    try {
      // Using eth_accounts instead of eth_requestAccounts to check connection without triggering popup
      const accounts = await ethereum.request({
        method: "eth_accounts",
      });
      
      if (Array.isArray(accounts) && accounts.length > 0) {
        const acc = accounts[0] as string;
        setAccount(acc);
        if (onConnect) onConnect(acc);
        
        // Get current chain ID
        const currentChainId = await ethereum.request({
          method: "eth_chainId",
        });
        
        if (typeof currentChainId === "string") {
          setChainId(currentChainId);
          if (onChainChanged) onChainChanged(currentChainId);
        }
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  }, [onConnect, onChainChanged]);

  useEffect(() => {
    const ethereum = getEthereum();
    setIsMetamaskInstalled(!!ethereum?.isMetaMask);

    // Check for existing connection on component mount
    checkConnection();

    if (!ethereum) return;

    // Define handlers properly typed for each event
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        setAccount(null);
        if (onConnect) onConnect("");
      } else {
        const acc = accounts[0];
        setAccount(acc);
        if (onConnect) onConnect(acc);
      }
    };

    const handleChainChanged = (newChainId: string) => {
      setChainId(newChainId);
      if (onChainChanged) onChainChanged(newChainId);
    };

    // Add event listeners
    ethereum.on("accountsChanged", handleAccountsChanged);
    ethereum.on("chainChanged", handleChainChanged);

    // Cleanup event listeners on unmount
    return () => {
      if (!ethereum) return;
      ethereum.removeListener("accountsChanged", handleAccountsChanged);
      ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [onConnect, onChainChanged, checkConnection]);

  const connect = async () => {
    const ethereum = getEthereum();
    if (!ethereum) {
      alert("MetaMask is not installed!");
      return;
    }
    setConnecting(true);
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      
      if (Array.isArray(accounts) && accounts.length > 0) {
        const acc = accounts[0] as string;
        setAccount(acc);
        if (onConnect) onConnect(acc);
        
        // Get current chain ID
        const currentChainId = await ethereum.request({
          method: "eth_chainId",
        });
        
        if (typeof currentChainId === "string") {
          setChainId(currentChainId);
          if (onChainChanged) onChainChanged(currentChainId);
        }
      }
    }  catch (error: unknown) {
        console.error("MetaMask connection error:", error);
        
        // Type-safe error handling
        if (
          typeof error === 'object' &&
          error !== null &&
          'code' in error &&
          'message' in error
        ) {
          const typedError = error as { code: unknown; message: unknown };
          
          // Handle user rejection error (code 4001)
          if (typedError.code === 4001) {
            alert("Please connect to MetaMask.");
          } 
          // Handle messages from standard Error objects
          else if (typeof typedError.message === 'string') {
            alert(`Error connecting to MetaMask: ${typedError.message}`);
          }
        } else if (error instanceof Error) {
          alert(`Error connecting to MetaMask: ${error.message}`);
        } else {
          alert("Unknown error occurred during connection");
        }
      } finally {
      setConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    if (onConnect) onConnect("");
  };

  if (!isMetamaskInstalled) {
    return (
      <div className="wallet-container">
        <p>Please install MetaMask to connect your wallet.</p>
        <a 
          className="connect-button" 
          href="https://metamask.io/download/" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          Install MetaMask
        </a>
      </div>
    );
  }

  if (account) {
    return (
      <div className="connected-display">
        <div className="address-chip text-truncate">
          {account.slice(0, 6)}...{account.slice(-4)}
          {chainId && ` (Chain ${parseInt(chainId, 16)})`}
        </div>
        <button 
          className="connect-button" 
          onClick={disconnect}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button 
      className="connect-button" 
      onClick={connect} 
      disabled={connecting}
    >
      {connecting ? "Connecting..." : "Connect Wallet"}
    </button>
  );
};

export default WalletConnect;