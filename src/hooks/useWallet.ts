
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../providers/Web3Provider';
import { tokenService } from '../services/TokenService';
import { CHAIN_ID } from '../lib/constants';
import { useToast } from '@/hooks/use-toast';

export const useWallet = () => {
  const { isConnected, address, chainId } = useWeb3();
  const [btcBalance, setBtcBalance] = useState('0');
  const [stCoreBalance, setStCoreBalance] = useState('0');
  const [coreBalance, setCoreBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(true);
  const [isCorrectChain, setIsCorrectChain] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsCorrectChain(chainId === CHAIN_ID);
  }, [chainId]);

  useEffect(() => {
    const loadBalances = async () => {
      if (isConnected && address && isCorrectChain) {
        setIsLoading(true);
        try {
          const [btcInfo, stCoreInfo, coreInfo] = await Promise.all([
            tokenService.getBTCTokenInfo(address),
            tokenService.getStCORETokenInfo(address),
            tokenService.getCORETokenInfo(address)
          ]);
          
          setBtcBalance(btcInfo.formattedBalance);
          setStCoreBalance(stCoreInfo.formattedBalance);
          setCoreBalance(coreInfo.formattedBalance);
        } catch (error) {
          console.error("Error loading token balances:", error);
          toast({
            title: "Failed to load balances",
            description: "Please check your connection and try again.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setBtcBalance('0');
        setStCoreBalance('0');
        setCoreBalance('0');
        setIsLoading(false);
      }
    };

    loadBalances();
    
    // Set up interval to refresh balances
    const intervalId = setInterval(loadBalances, 30000);
    
    return () => clearInterval(intervalId);
  }, [isConnected, address, isCorrectChain, toast]);

  const switchToCorrectChain = async () => {
    if (!window.ethereum) {
      toast({
        title: "No Ethereum wallet detected",
        description: "Please install MetaMask or another wallet.",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
      });
      return true;
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${CHAIN_ID.toString(16)}`,
                chainName: 'Core Blockchain',
                nativeCurrency: {
                  name: 'CORE',
                  symbol: 'CORE',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc.coredao.org'],
                blockExplorerUrls: ['https://scan.coredao.org'],
              },
            ],
          });
          return true;
        } catch (addError) {
          console.error("Error adding chain:", addError);
          toast({
            title: "Failed to add Core chain",
            description: "Please add the Core chain to your wallet manually.",
            variant: "destructive"
          });
          return false;
        }
      }
      console.error("Error switching chain:", switchError);
      toast({
        title: "Failed to switch chain",
        description: "Please switch to the Core chain manually.",
        variant: "destructive"
      });
      return false;
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "No Ethereum wallet detected",
        description: "Please install MetaMask or another wallet.",
        variant: "destructive"
      });
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length === 0) {
        toast({
          title: "No accounts found",
          description: "Please create an account in your wallet.",
          variant: "destructive"
        });
        return;
      }

      // Check if on correct chain, if not try to switch
      if (chainId !== CHAIN_ID) {
        await switchToCorrectChain();
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Failed to connect wallet",
        description: "Please try again or use a different wallet.",
        variant: "destructive"
      });
    }
  };

  return {
    isConnected,
    address,
    chainId,
    isCorrectChain,
    btcBalance,
    stCoreBalance,
    coreBalance,
    isLoading,
    connectWallet,
    switchToCorrectChain
  };
};
