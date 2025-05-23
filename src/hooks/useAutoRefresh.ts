
import { useState, useEffect, useCallback } from 'react';
import { useWallet } from './useWallet';

interface UseAutoRefreshProps {
  refreshInterval?: number;
  onRefresh: () => Promise<void>;
  dependencies?: any[];
}

export const useAutoRefresh = ({ 
  refreshInterval = 30000, 
  onRefresh,
  dependencies = []
}: UseAutoRefreshProps) => {
  const { isConnected, isCorrectChain } = useWallet();
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(Date.now());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const refresh = useCallback(async () => {
    if (!isConnected || !isCorrectChain || isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
      setLastRefreshTime(Date.now());
    } catch (error) {
      console.error("Error during refresh:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh, isConnected, isCorrectChain, isRefreshing]);

  // Set up initial and interval refreshing
  useEffect(() => {
    // Initial refresh
    refresh();

    // Set up interval for refreshing
    const intervalId = setInterval(refresh, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [refresh, refreshInterval, ...dependencies]);

  // Listen for blockchain events that might trigger refreshes
  useEffect(() => {
    const handleBlockUpdate = () => {
      refresh();
    };

    if (window.ethereum && isConnected) {
      window.ethereum.on('block', handleBlockUpdate);
      
      return () => {
        window.ethereum.removeListener('block', handleBlockUpdate);
      };
    }
  }, [isConnected, refresh]);

  return { 
    refresh,
    lastRefreshTime,
    isRefreshing
  };
};
