
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useWallet } from '@/hooks/useWallet';
import { btcInsurancePoolService, StakeType } from '@/services/BTCInsurancePoolService';
import { formatNumber } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const InvestmentDashboard = () => {
  const { isConnected, address, isCorrectChain, btcBalance, stCoreBalance, coreBalance } = useWallet();
  const [stakerInfo, setStakerInfo] = useState<any>(null);
  const [poolStats, setPoolStats] = useState<any>(null);
  const [apyRates, setApyRates] = useState<any>({
    btcApy: '12.4%',
    stCoreApy: '8.9%',
    dualApy: '15.9%'
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadInvestmentData = async () => {
      if (isConnected && address && isCorrectChain) {
        setIsLoading(true);
        try {
          const [info, stats, apy] = await Promise.all([
            btcInsurancePoolService.getStakerInfo(address),
            btcInsurancePoolService.getPoolStats(),
            btcInsurancePoolService.getAPYRates()
          ]);
          
          setStakerInfo(info);
          setPoolStats(stats);
          setApyRates(apy);
        } catch (error) {
          console.error("Error loading investment data:", error);
          toast({
            title: "Failed to load data",
            description: "Unable to fetch investment data from the blockchain.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadInvestmentData();
    
    // Set up interval to refresh data
    const intervalId = setInterval(loadInvestmentData, 30000);
    return () => clearInterval(intervalId);
  }, [isConnected, address, isCorrectChain, toast]);

  const calculateTotalStakedValue = () => {
    if (!stakerInfo) return 0;
    
    // Mock BTC price: $45,000, CORE price: $1.5
    const btcPrice = 45000;
    const corePrice = 1.5;
    
    const btcValue = parseFloat(stakerInfo.btcAmount || '0') * btcPrice;
    const stCoreValue = parseFloat(stakerInfo.stCoreAmount || '0') * corePrice;
    
    return btcValue + stCoreValue;
  };

  const calculateProjectedRewards = () => {
    if (!stakerInfo || !apyRates) return 0;
    
    const btcApy = parseFloat(apyRates.btcApy.replace('%', '')) / 100;
    const stCoreApy = parseFloat(apyRates.stCoreApy.replace('%', '')) / 100;
    
    const btcAmount = parseFloat(stakerInfo.btcAmount || '0');
    const stCoreAmount = parseFloat(stakerInfo.stCoreAmount || '0');
    
    // Annual rewards calculation
    const btcRewards = btcAmount * btcApy;
    const stCoreRewards = stCoreAmount * stCoreApy;
    
    return btcRewards + stCoreRewards;
  };

  if (!isConnected || !isCorrectChain) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Investment Portfolio</CardTitle>
          <CardDescription>Connect your wallet to view your investments</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Please connect your wallet to the Core Testnet to view your investment data.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Investment Portfolio</CardTitle>
          <CardDescription>Loading your investment data...</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  const totalStakedValue = calculateTotalStakedValue();
  const projectedAnnualRewards = calculateProjectedRewards();
  const hasStakedAssets = stakerInfo && (parseFloat(stakerInfo.btcAmount || '0') > 0 || parseFloat(stakerInfo.stCoreAmount || '0') > 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Investment Portfolio</CardTitle>
          <CardDescription>Your staking positions and rewards</CardDescription>
        </CardHeader>
        <CardContent>
          {!hasStakedAssets ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">You don't have any staked assets yet.</p>
              <Button className="bg-corezero-purple">
                Start Staking
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">${formatNumber(totalStakedValue.toString(), 2)}</div>
                    <p className="text-xs text-muted-foreground">Total Staked Value</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{formatNumber(projectedAnnualRewards.toString(), 4)} CORE</div>
                    <p className="text-xs text-muted-foreground">Projected Annual Rewards</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {stakerInfo.stakeType === StakeType.BTC_ONLY ? 'BTC Only' : 
                       stakerInfo.stakeType === StakeType.STCORE_ONLY ? 'stCORE Only' : 
                       stakerInfo.stakeType === StakeType.DUAL ? 'Dual Staking' : 'None'}
                    </div>
                    <p className="text-xs text-muted-foreground">Staking Strategy</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Staking Positions</h3>
                
                {parseFloat(stakerInfo.btcAmount || '0') > 0 && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-medium">Bitcoin (BTC)</h4>
                          <p className="text-sm text-muted-foreground">Insurance Pool Staking</p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatNumber(stakerInfo.btcAmount, 6)} BTC</div>
                          <div className="text-sm text-muted-foreground">≈ ${formatNumber((parseFloat(stakerInfo.btcAmount) * 45000).toString(), 2)}</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>APY</span>
                          <span className="font-medium">{apyRates.btcApy}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Staking Start</span>
                          <span className="font-medium">
                            {stakerInfo.stakingStartTime > 0 ? 
                              new Date(stakerInfo.stakingStartTime * 1000).toLocaleDateString() : 
                              'N/A'
                            }
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {parseFloat(stakerInfo.stCoreAmount || '0') > 0 && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-medium">stCORE</h4>
                          <p className="text-sm text-muted-foreground">Insurance Pool Staking</p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatNumber(stakerInfo.stCoreAmount, 2)} stCORE</div>
                          <div className="text-sm text-muted-foreground">≈ ${formatNumber((parseFloat(stakerInfo.stCoreAmount) * 1.5).toString(), 2)}</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>APY</span>
                          <span className="font-medium">{apyRates.stCoreApy}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Staking Start</span>
                          <span className="font-medium">
                            {stakerInfo.stakingStartTime > 0 ? 
                              new Date(stakerInfo.stakingStartTime * 1000).toLocaleDateString() : 
                              'N/A'
                            }
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-medium">Rewards Earned</h4>
                        <p className="text-sm text-muted-foreground">Total claimed rewards</p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatNumber(stakerInfo.rewardsClaimed, 4)} CORE</div>
                        <div className="text-sm text-muted-foreground">≈ ${formatNumber((parseFloat(stakerInfo.rewardsClaimed) * 1.5).toString(), 2)}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pool Statistics</CardTitle>
          <CardDescription>Insurance pool performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Your Pool Share (BTC)</span>
                <span>
                  {poolStats && stakerInfo ? 
                    `${((parseFloat(stakerInfo.btcAmount || '0') / parseFloat(poolStats.totalBTCStaked || '1')) * 100).toFixed(4)}%` : 
                    '0%'
                  }
                </span>
              </div>
              <Progress 
                value={poolStats && stakerInfo ? 
                  (parseFloat(stakerInfo.btcAmount || '0') / parseFloat(poolStats.totalBTCStaked || '1')) * 100 : 
                  0
                } 
                className="h-2" 
              />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Your Pool Share (stCORE)</span>
                <span>
                  {poolStats && stakerInfo ? 
                    `${((parseFloat(stakerInfo.stCoreAmount || '0') / parseFloat(poolStats.totalStCoreStaked || '1')) * 100).toFixed(4)}%` : 
                    '0%'
                  }
                </span>
              </div>
              <Progress 
                value={poolStats && stakerInfo ? 
                  (parseFloat(stakerInfo.stCoreAmount || '0') / parseFloat(poolStats.totalStCoreStaked || '1')) * 100 : 
                  0
                } 
                className="h-2" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center">
                <div className="text-lg font-bold">{poolStats ? formatNumber(poolStats.totalBTCStaked, 2) : '0'}</div>
                <div className="text-xs text-muted-foreground">Total BTC Staked</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{poolStats ? formatNumber(poolStats.totalStCoreStaked, 0) : '0'}</div>
                <div className="text-xs text-muted-foreground">Total stCORE Staked</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestmentDashboard;
