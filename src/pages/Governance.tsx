
import React, { useState, useEffect } from 'react';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWallet } from '@/hooks/useWallet';
import { stCoreGovernanceService } from '@/services/StCoreGovernanceService';
import { toast } from "@/hooks/use-toast";

const GovernancePage = () => {
  const { isConnected, address } = useWallet();
  const [proposals, setProposals] = useState([]);
  const [votingPower, setVotingPower] = useState('0');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGovernanceData = async () => {
      if (isConnected && address) {
        setLoading(true);
        try {
          const [userVotingPower, activeProposals] = await Promise.all([
            stCoreGovernanceService.getVotingPower(address),
            stCoreGovernanceService.getActiveProposals()
          ]);
          
          setVotingPower(userVotingPower);
          setProposals(activeProposals);
        } catch (error) {
          console.error("Error loading governance data:", error);
          toast({
            title: "Failed to load governance data",
            description: "Please check your connection and try again.",
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadGovernanceData();
    // Refresh every minute
    const intervalId = setInterval(loadGovernanceData, 60000);
    
    return () => clearInterval(intervalId);
  }, [isConnected, address]);

  const handleVote = async (proposalId, support) => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to vote.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await stCoreGovernanceService.castVote(proposalId, support);
      toast({
        title: "Vote cast successfully!",
        description: "Your vote has been recorded on the blockchain.",
      });
      
      // Refresh proposals
      const activeProposals = await stCoreGovernanceService.getActiveProposals();
      setProposals(activeProposals);
    } catch (error) {
      console.error("Error voting:", error);
      toast({
        title: "Failed to cast vote",
        description: "Please check your connection and try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow mt-16">
        <section className="py-16 relative">
          <div className="absolute top-1/4 right-0 w-80 h-80 bg-corezero-accent/5 rounded-full blur-3xl -z-10"></div>
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-gradient">Governance</span> Portal
              </h2>
              <p className="text-lg text-muted-foreground">
                Shape the future of CoreZero by voting on important proposals with your stCORE tokens.
              </p>
              {isConnected && (
                <div className="mt-4 p-3 bg-muted/30 inline-block rounded-lg">
                  <p>Your voting power: <span className="font-bold">{votingPower} stCORE</span></p>
                </div>
              )}
            </div>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-corezero-purple"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {proposals.length > 0 ? proposals.map((proposal) => (
                  <Card key={proposal.id} className="hover-scale">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <span className="inline-flex items-center rounded-full bg-corezero-purple/10 px-2.5 py-0.5 text-xs font-medium text-corezero-purple">
                          Proposal #{proposal.id}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Active
                        </span>
                      </div>
                      <CardTitle className="text-xl mt-2">{proposal.title}</CardTitle>
                      <CardDescription>{proposal.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Votes For:</span>
                          <span className="font-medium">{proposal.votesFor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Votes Against:</span>
                          <span className="font-medium">{proposal.votesAgainst}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">End Date:</span>
                          <span className="font-medium">{new Date(proposal.endDate * 1000).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleVote(proposal.id, true)}
                        disabled={!isConnected}
                      >
                        Vote For
                      </Button>
                      <Button 
                        className="flex-1 bg-red-600 hover:bg-red-700"
                        onClick={() => handleVote(proposal.id, false)}
                        disabled={!isConnected}
                      >
                        Vote Against
                      </Button>
                    </CardFooter>
                  </Card>
                )) : (
                  <div className="col-span-2 text-center py-10 border border-dashed rounded-xl">
                    <p className="text-muted-foreground">No active proposals at this time.</p>
                  </div>
                )}
              </div>
            )}
            
            <div className="max-w-lg mx-auto p-6 border border-border rounded-xl bg-card">
              <h3 className="text-xl font-bold mb-4">Stake stCORE for Governance Power</h3>
              <p className="text-muted-foreground mb-4">Stake your stCORE tokens to gain voting rights in the CoreZero governance system.</p>
              <Button className="w-full bg-corezero-purple" onClick={() => window.location.href = '/staking'}>
                Stake Now
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default GovernancePage;
