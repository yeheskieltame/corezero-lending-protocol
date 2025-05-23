import React, { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { truncateAddress } from '@/lib/utils';
import { Menu, LogOut } from 'lucide-react';

const ConnectWallet = () => {
  const { 
    isConnected, 
    address, 
    isCorrectChain,
    btcBalance,
    stCoreBalance,
    coreBalance,
    isLoading,
    connectWallet,
    switchToCorrectChain
  } = useWallet();

  // Format balance to show only 4 decimal places and add thousands separators
  const formatBalance = (balance: string): string => {
    const num = parseFloat(balance);
    if (isNaN(num)) return '0';
    
    // If balance is very small, show full precision
    if (num < 0.0001) return num.toString();
    
    // Otherwise format with thousands separators and 4 decimal places max
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4
    });
  };

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
          <span className="text-sm font-bold">{isLoading ? '...' : formatBalance(btcBalance)}</span>
        </div>
        <div className="bg-muted/50 px-3 py-1.5 rounded-lg flex items-center gap-2">
          <span className="text-sm">stCORE:</span>
          <span className="text-sm font-bold">{isLoading ? '...' : formatBalance(stCoreBalance)}</span>
        </div>
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="border-corezero-purple text-corezero-purple hover:bg-corezero-purple/10"
          >
            {truncateAddress(address || '')}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4">
          <div className="space-y-3">
            <h3 className="font-medium">Connected Wallet</h3>
            <div className="break-all text-sm">{address}</div>
            
            <div className="pt-2 border-t border-border">
              <h4 className="text-sm text-muted-foreground mb-2">Balances</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>BTC</span>
                  <span className="font-medium">{isLoading ? '...' : formatBalance(btcBalance)}</span>
                </div>
                <div className="flex justify-between">
                  <span>stCORE</span>
                  <span className="font-medium">{isLoading ? '...' : formatBalance(stCoreBalance)}</span>
                </div>
                <div className="flex justify-between">
                  <span>CORE</span>
                  <span className="font-medium">{isLoading ? '...' : formatBalance(coreBalance)}</span>
                </div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2" 
              onClick={() => {
                window.location.reload();
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ConnectWallet;
