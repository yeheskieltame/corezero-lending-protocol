
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const StakingInterface = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('BTC');
  const [amount, setAmount] = useState('');

  return (
    <section className="py-16 relative">
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
                        Core (CORE)
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
                        <Button variant="ghost" size="sm" onClick={() => setAmount(selectedCurrency === 'BTC' ? '0.42' : '1250')}>
                          MAX
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Staking APY</span>
                      <span className="text-sm font-medium">
                        {selectedCurrency === 'BTC' ? '12.4%' : '8.9%'}
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
                  
                  <Button className="w-full bg-corezero-purple">
                    {amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 ? 
                      `Stake ${amount} ${selectedCurrency}` : 
                      'Enter Amount'
                    }
                  </Button>
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
                        Core (CORE)
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="unstake-amount">Amount</Label>
                      <span className="text-sm text-muted-foreground">
                        Staked: {selectedCurrency === 'BTC' ? '0.15' : '750'} {selectedCurrency}
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
                        <Button variant="ghost" size="sm" onClick={() => setAmount(selectedCurrency === 'BTC' ? '0.15' : '750')}>
                          MAX
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Accrued Rewards</span>
                      <span className="text-sm font-medium">
                        {selectedCurrency === 'BTC' ? '0.008 BTC' : '35 CORE'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Unstaking Fee</span>
                      <span className="text-sm font-medium">0%</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline">Withdraw Rewards Only</Button>
                    <Button className="bg-corezero-purple">
                      {amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 ? 
                        `Unstake ${amount} ${selectedCurrency}` : 
                        'Enter Amount'
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
                  <span className="font-medium">$2,845,632</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>BTC Staked</span>
                  <span className="font-medium">125 BTC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>CORE Staked</span>
                  <span className="font-medium">75,000 CORE</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Pool Utilization</span>
                    <span>72.5%</span>
                  </div>
                  <Progress value={72.5} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Coverage Ratio</span>
                    <span>3.2x</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
              </div>
              
              <div className="rounded-xl p-4 bg-gradient-to-br from-corezero-purple/20 to-corezero-accent/10 border border-corezero-purple/20">
                <h4 className="font-medium mb-2">Rewards Distribution</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>BTC APY</span>
                    <span className="font-medium">12.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CORE APY</span>
                    <span className="font-medium">8.9%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dual Staking Boost</span>
                    <span className="font-medium">+3.5%</span>
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
