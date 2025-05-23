
import React from 'react';
import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components/ui/button';
import { truncateAddress } from '@/lib/utils';

const ConnectWallet = () => {
  const { 
    isConnected, 
    address, 
    isCorrectChain,
    btcBalance,
    stCoreBalance, 
    connectWallet,
    switchToCorrectChain
  } = useWallet();

  if (!isConnected) {
    return (
      <Button className="bg-corezero-purple" onClick={connectWallet}>
        Connect Wallet
      </Button>
    );
  }

  if (!isCorrectChain) {
    return (
      <Button variant="destructive" onClick={switchToCorrectChain}>
        Switch to Core Chain
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="hidden md:flex gap-4">
        <div className="bg-muted/50 px-3 py-1.5 rounded-lg flex items-center gap-2">
          <span className="text-sm">BTC:</span>
          <span className="text-sm font-bold">{parseFloat(btcBalance).toFixed(4)}</span>
        </div>
        <div className="bg-muted/50 px-3 py-1.5 rounded-lg flex items-center gap-2">
          <span className="text-sm">stCORE:</span>
          <span className="text-sm font-bold">{parseFloat(stCoreBalance).toFixed(2)}</span>
        </div>
      </div>
      <Button 
        variant="outline" 
        className="border-corezero-purple text-corezero-purple hover:bg-corezero-purple/10"
      >
        {truncateAddress(address || '')}
      </Button>
    </div>
  );
};

export default ConnectWallet;
