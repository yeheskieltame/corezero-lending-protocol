
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';
import { btcInsurancePoolService, StakeType } from '@/services/BTCInsurancePoolService';
import { tokenService } from '@/services/TokenService';
import { formatNumber } from '@/lib/utils';

const StakingInterface = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [btcAmount, setBtcAmount] = useState('');
  const [stCoreAmount, setStCoreAmount] = useState('');
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [stakerInfo, setStakerInfo] = useState<any>(null);
  const [poolStats, setPoolStats] = useState<any>(null);
  const [apyRates, setApyRates] = useState<any>({
    btcApy: '12.4%',
    stCoreApy: '8.9%',
    dualApy: '15.9%'
  });
  
  const { isConnected, address, isCorrectChain } = useWallet();
  const { toast } = useToast();

  // Load staking data
  useEffect(() => {
    const loadStakingData = async () => {
      if (isConnected && address && isCorrectChain) {
        try {
          // Get staker info
          const info = await btcInsurancePoolService.getStakerInfo(address);
          setStakerInfo(info);
          
          // Get pool stats
          const stats = await btcInsurancePoolService.getPoolStats();
          setPoolStats(stats);
          
          // Get APY rates
          const apy = await btcInsurancePoolService.getAPYRates();
          setApyRates(apy);
        } catch (error) {
          console.error("Error loading staking data:", error);
        }
      }
    };
    
    loadStakingData();
    
    // Set up interval to refresh data
    const intervalId = setInterval(loadStakingData, 30000);
    return () => clearInterval(intervalId);
  }, [isConnected, address, isCorrectChain]);

  const handleStake = async () => {
    if (!isConnected || !isCorrectChain) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to the Core chain.",
        variant: "destructive"
      });
      return;
    }
    
    if (parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to stake.",
        variant: "destructive"
      });
      return;
    }
    
    setIsStaking(true);
    
    try {
      let success;
      
      if (selectedCurrency === 'BTC') {
        success = await btcInsurancePoolService.stakeBTC(amount);
      } else {
        success = await btcInsurancePoolService.stakeStCORE(amount);
      }
      
      if (success) {
        toast({
          title: "Staking successful",
          description: `Successfully staked ${amount} ${selectedCurrency}.`,
          variant: "default"
        });
        setAmount('');
        
        // Refresh staker info
        const info = await btcInsurancePoolService.getStakerInfo(address!);
        setStakerInfo(info);
      }
    } catch (error: any) {
      console.error("Staking error:", error);
      toast({
        title: "Staking failed",
        description: error.message || "An error occurred while staking.",
        variant: "destructive"
      });
    } finally {
      setIsStaking(false);
    }
  };

  const handleDualStake = async () => {
    if (!isConnected || !isCorrectChain) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to the Core chain.",
        variant: "destructive"
      });
      return;
    }
    
    if (parseFloat(btcAmount) <= 0 || parseFloat(stCoreAmount) <= 0) {
      toast({
        title: "Invalid amounts",
        description: "Please enter valid amounts for both BTC and stCORE.",
        variant: "destructive"
      });
      return;
    }
    
    setIsStaking(true);
    
    try {
      const success = await btcInsurancePoolService.stakeDual(btcAmount, stCoreAmount);
      
      if (success) {
        toast({
          title: "Dual staking successful",
          description: `Successfully staked ${btcAmount} BTC and ${stCoreAmount} stCORE.`,
          variant: "default"
        });
        setBtcAmount('');
        setStCoreAmount('');
        
        // Refresh staker info
        const info = await btcInsurancePoolService.getStakerInfo(address!);
        setStakerInfo(info);
      }
    } catch (error: any) {
      console.error("Dual staking error:", error);
      toast({
        title: "Dual staking failed",
        description: error.message || "An error occurred while staking.",
        variant: "destructive"
      });
    } finally {
      setIsStaking(false);
    }
  };

  const handleUnstake = async () => {
    if (!isConnected || !isCorrectChain) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to the Core chain.",
        variant: "destructive"
      });
      return;
    }
    
    if (!stakerInfo) return;
    
    const btcAmountToUnstake = selectedCurrency === 'BTC' ? amount : '0';
    const stCoreAmountToUnstake = selectedCurrency === 'CORE' ? amount : '0';
    
    setIsUnstaking(true);
    
    try {
      const success = await btcInsurancePoolService.unstake(btcAmountToUnstake, stCoreAmountToUnstake);
      
      if (success) {
        toast({
          title: "Unstaking successful",
          description: `Successfully unstaked ${amount} ${selectedCurrency}.`,
          variant: "default"
        });
        setAmount('');
        
        // Refresh staker info
        const info = await btcInsurancePoolService.getStakerInfo(address!);
        setStakerInfo(info);
      }
    } catch (error: any) {
      console.error("Unstaking error:", error);
      toast({
        title: "Unstaking failed",
        description: error.message || "An error occurred while unstaking.",
        variant: "destructive"
      });
    } finally {
      setIsUnstaking(false);
    }
  };

  const handleClaimRewards = async () => {
    if (!isConnected || !isCorrectChain) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to the Core chain.",
        variant: "destructive"
      });
      return;
    }
    
    setIsClaiming(true);
    
    try {
      const claimedAmount = await btcInsurancePoolService.claimRewards();
      
      toast({
        title: "Rewards claimed",
        description: `Successfully claimed ${claimedAmount} CORE rewards.`,
        variant: "default"
      });
      
      // Refresh staker info
      const info = await btcInsurancePoolService.getStakerInfo(address!);
      setStakerInfo(info);
    } catch (error: any) {
      console.error("Claiming rewards error:", error);
      toast({
        title: "Claiming failed",
        description: error.message || "An error occurred while claiming rewards.",
        variant: "destructive"
      });
    } finally {
      setIsClaiming(false);
    }
  };

  // Conditional rendering for wallet not connected
  if (!isConnected || !isCorrectChain) {
    return (
      <section id="staking" className="py-16 relative">
        <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-corezero-accent/5 rounded-full blur-3xl -z-10"></div>
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stake & <span className="text-gradient">Earn</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Connect your wallet to start staking BTC or CORE to the Insurance Pool and earn enhanced yield.
            </p>
          </div>
          
          <div className="flex justify-center">
            <Card className="max-w-md w-full">
              <CardHeader>
                <CardTitle>Wallet Connection Required</CardTitle>
                <CardDescription>
                  Please connect your wallet to access the staking interface.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl p-4 bg-gradient-to-br from-corezero-purple/20 to-corezero-accent/10 border border-corezero-purple/20">
                  <h4 className="font-medium mb-2">Rewards Overview</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>BTC APY</span>
                      <span className="font-medium">{apyRates.btcApy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>stCORE APY</span>
                      <span className="font-medium">{apyRates.stCoreApy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dual Staking Boost</span>
                      <span className="font-medium">+3.5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-corezero-purple">
                  Connect Wallet
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  // Main staking interface
  return (
    <section id="staking" className="py-16 relative">
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-corezero-accent/5 rounded-full blur-3xl -z-10"></div>
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stake & <span className="text-gradient">Earn</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Stake your BTC or CORE to the Insurance Pool and earn enhanced yield while supporting developer loans.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Staking Portal</CardTitle>
              <CardDescription>Stake your assets to earn rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="stake" className="w-full">
                <TabsList className="grid grid-cols-2 mb-8">
                  <TabsTrigger value="stake">Stake</TabsTrigger>
                  <TabsTrigger value="unstake">Unstake</TabsTrigger>
                </TabsList>
                
                <TabsContent value="stake" className="space-y-6">
                  <div className="space-y-2">
                    <Label>Select Asset</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        variant={selectedCurrency === 'BTC' ? 'default' : 'outline'} 
                        className={selectedCurrency === 'BTC' ? 'bg-corezero-purple' : ''}
                        onClick={() => setSelectedCurrency('BTC')}
                      >
                        Bitcoin (BTC)
                      </Button>
                      <Button 
                        variant={selectedCurrency === 'CORE' ? 'default' : 'outline'} 
                        className={selectedCurrency === 'CORE' ? 'bg-corezero-purple' : ''}
                        onClick={() => setSelectedCurrency('CORE')}
                      >
                        stCore (stCORE)
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="stake-amount">Amount</Label>
                      <span className="text-sm text-muted-foreground">
                        Balance: {selectedCurrency === 'BTC' ? '0.42' : '1,250'} {selectedCurrency}
                      </span>
                    </div>
                    <div className="relative">
                      <Input 
                        id="stake-amount" 
                        placeholder="0.0" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pr-16"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setAmount(selectedCurrency === 'BTC' ? '0.42' : '1250')}
                        >
                          MAX
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Staking APY</span>
                      <span className="text-sm font-medium">
                        {selectedCurrency === 'BTC' ? apyRates.btcApy : apyRates.stCoreApy}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Lock Period</span>
                      <span className="text-sm font-medium">Flexible</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Pool Share</span>
                      <span className="text-sm font-medium">
                        {amount && !isNaN(parseFloat(amount)) ? 
                          `${(parseFloat(amount) / (selectedCurrency === 'BTC' ? 125 : 75000) * 100).toFixed(4)}%` : 
                          '0%'
                        }
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-corezero-purple"
                    onClick={handleStake}
                    disabled={isStaking || !amount || parseFloat(amount) <= 0}
                  >
                    {isStaking ? 'Staking...' : 
                      (amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 ? 
                        `Stake ${amount} ${selectedCurrency}` : 
                        'Enter Amount'
                      )
                    }
                  </Button>
                  
                  <div className="pt-4 border-t border-border">
                    <h3 className="text-lg font-medium mb-4">Dual Staking (Higher APY)</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor="btc-amount">BTC Amount</Label>
                        <Input 
                          id="btc-amount" 
                          placeholder="0.0 BTC" 
                          value={btcAmount}
                          onChange={(e) => setBtcAmount(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stcore-amount">stCORE Amount</Label>
                        <Input 
                          id="stcore-amount" 
                          placeholder="0.0 stCORE" 
                          value={stCoreAmount}
                          onChange={(e) => setStCoreAmount(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-gradient-to-r from-corezero-purple/10 to-corezero-accent/5 mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Combined APY</span>
                        <span className="text-sm font-medium">{apyRates.dualApy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Dual Staking Bonus</span>
                        <span className="text-sm font-medium">+3.5%</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-corezero-purple"
                      onClick={handleDualStake}
                      disabled={isStaking || !btcAmount || !stCoreAmount || parseFloat(btcAmount) <= 0 || parseFloat(stCoreAmount) <= 0}
                    >
                      {isStaking ? 'Staking...' : 'Stake Both Assets'}
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="unstake" className="space-y-6">
                  <div className="space-y-2">
                    <Label>Select Asset</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        variant={selectedCurrency === 'BTC' ? 'default' : 'outline'} 
                        className={selectedCurrency === 'BTC' ? 'bg-corezero-purple' : ''}
                        onClick={() => setSelectedCurrency('BTC')}
                      >
                        Bitcoin (BTC)
                      </Button>
                      <Button 
                        variant={selectedCurrency === 'CORE' ? 'default' : 'outline'} 
                        className={selectedCurrency === 'CORE' ? 'bg-corezero-purple' : ''}
                        onClick={() => setSelectedCurrency('CORE')}
                      >
                        stCORE (stCORE)
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="unstake-amount">Amount</Label>
                      <span className="text-sm text-muted-foreground">
                        Staked: {selectedCurrency === 'BTC' ? 
                          (stakerInfo ? formatNumber(stakerInfo.formattedBtcAmount, 4) : '0.00') : 
                          (stakerInfo ? formatNumber(stakerInfo.formattedStCoreAmount, 2) : '0.00')
                        } {selectedCurrency}
                      </span>
                    </div>
                    <div className="relative">
                      <Input 
                        id="unstake-amount" 
                        placeholder="0.0" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pr-16"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setAmount(
                            selectedCurrency === 'BTC' ? 
                            (stakerInfo?.formattedBtcAmount || '0') : 
                            (stakerInfo?.formattedStCoreAmount || '0')
                          )}
                        >
                          MAX
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Accrued Rewards</span>
                      <span className="text-sm font-medium">
                        {stakerInfo ? formatNumber(stakerInfo.formattedRewardsClaimed, 4) : '0'} CORE
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Unstaking Fee</span>
                      <span className="text-sm font-medium">0%</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant="outline"
                      onClick={handleClaimRewards}
                      disabled={isClaiming || !stakerInfo || parseFloat(stakerInfo?.formattedRewardsClaimed || '0') <= 0}
                    >
                      {isClaiming ? 'Claiming...' : 'Withdraw Rewards Only'}
                    </Button>
                    <Button 
                      className="bg-corezero-purple"
                      onClick={handleUnstake}
                      disabled={isUnstaking || !amount || parseFloat(amount) <= 0}
                    >
                      {isUnstaking ? 'Unstaking...' : 
                        (amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 ? 
                          `Unstake ${amount} ${selectedCurrency}` : 
                          'Enter Amount'
                        )
                      }
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Insurance Pool Stats</CardTitle>
              <CardDescription>Current pool metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Value Locked</span>
                  <span className="font-medium">
                    {poolStats?.totalValueLocked || '$2,845,632'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>BTC Staked</span>
                  <span className="font-medium">
                    {poolStats ? formatNumber(poolStats.formattedBtcAmount, 2) : '125'} BTC
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>stCORE Staked</span>
                  <span className="font-medium">
                    {poolStats ? formatNumber(poolStats.formattedStCoreAmount, 0) : '75,000'} stCORE
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Pool Utilization</span>
                    <span>{poolStats?.utilizationRate || '72.5%'}</span>
                  </div>
                  <Progress value={72.5} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Coverage Ratio</span>
                    <span>{poolStats?.coverageRatio || '3.2x'}</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
              </div>
              
              <div className="rounded-xl p-4 bg-gradient-to-br from-corezero-purple/20 to-corezero-accent/10 border border-corezero-purple/20">
                <h4 className="font-medium mb-2">Rewards Distribution</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>BTC APY</span>
                    <span className="font-medium">{apyRates.btcApy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>stCORE APY</span>
                    <span className="font-medium">{apyRates.stCoreApy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dual Staking Boost</span>
                    <span className="font-medium">+3.5%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Your Staking Position</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>BTC Staked</span>
                    <span className="font-medium">
                      {stakerInfo ? formatNumber(stakerInfo.formattedBtcAmount, 4) : '0.0000'} BTC
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>stCORE Staked</span>
                    <span className="font-medium">
                      {stakerInfo ? formatNumber(stakerInfo.formattedStCoreAmount, 2) : '0.00'} stCORE
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Staking Type</span>
                    <span className="font-medium">
                      {stakerInfo?.stakeType === StakeType.BTC ? 'BTC Only' : 
                       stakerInfo?.stakeType === StakeType.STCORE ? 'stCORE Only' : 
                       stakerInfo?.stakeType === StakeType.DUAL ? 'Dual Staking' : 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Rewards Earned</span>
                    <span className="font-medium">
                      {stakerInfo ? formatNumber(stakerInfo.formattedRewardsClaimed, 4) : '0.0000'} CORE
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Recent Pool Activities</h4>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        {i === 1 ? "0x3f...8a9d staked 0.5 BTC" :
                         i === 2 ? "0x7c...2e4f claimed 25 CORE rewards" :
                         "New loan covered: Protocol Beta"}
                      </span>
                      <span className="text-muted-foreground">{i * 2}h ago</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View All Stats</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default StakingInterface;
