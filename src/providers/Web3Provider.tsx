import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { Chain } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CHAIN_ID, CHAIN_NAME, CHAIN_RPC_URL } from '../lib/constants';

// Create custom Core Testnet chain
const coreChain: Chain = {
  id: CHAIN_ID,
  name: CHAIN_NAME,
  nativeCurrency: {
    name: 'tCORE2',
    symbol: 'tCORE2',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [CHAIN_RPC_URL],
    },
    public: {
      http: [CHAIN_RPC_URL],
    },
  },
  blockExplorers: {
    default: {
      name: 'Core Testnet Explorer',
      url: 'https://scan.test2.btcs.network',
    },
  },
  testnet: true,
};

// Create wagmi config using getDefaultConfig
const config = getDefaultConfig({
  appName: 'CoreZero',
  projectId: 'core-zero-demo', // Simple project ID for demo
  chains: [coreChain],
  transports: {
    [CHAIN_ID]: http(CHAIN_RPC_URL),
  },
  ssr: true,
});

// Create React Query client
const queryClient = new QueryClient();

// Create context for web3 state
interface Web3ContextProps {
  isConnected: boolean;
  address: string | undefined;
  chainId: number | undefined;
}

const Web3Context = createContext<Web3ContextProps>({
  isConnected: false,
  address: undefined,
  chainId: undefined,
});

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [chainId, setChainId] = useState<number | undefined>(undefined);

  // Setup wallet connection listeners
  useEffect(() => {
    // Listen for account changes
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
      } else {
        setAddress(undefined);
        setIsConnected(false);
      }
    };

    // Listen for chain changes
    const handleChainChanged = (chainId: string) => {
      setChainId(parseInt(chainId, 16));
    };

    // Check if wallet is already connected
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          handleAccountsChanged(accounts);
          
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          handleChainChanged(chainId);
          
          // Setup listeners
          window.ethereum.on('accountsChanged', handleAccountsChanged);
          window.ethereum.on('chainChanged', handleChainChanged);
        } catch (error) {
          console.error('Failed to connect to wallet:', error);
        }
      }
    };

    checkConnection();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Web3Context.Provider value={{ isConnected, address, chainId }}>
            {children}
          </Web3Context.Provider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
