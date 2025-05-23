
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-corezero-purple/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-corezero-accent/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              CoreZero: <span className="text-gradient">Revenue-Based</span> Funding for Core Blockchain
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Zero-collateral funding for Core blockchain projects. Get funded based on your future revenue instead of traditional collateral.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/dashboard">
                <Button className="bg-corezero-purple hover:bg-corezero-purple/90 text-white py-6 px-8 text-lg rounded-xl">
                  Explore Platform
                </Button>
              </Link>
              <Link to="/staking">
                <Button variant="outline" className="border-corezero-purple text-corezero-purple hover:bg-corezero-purple/10 py-6 px-8 text-lg rounded-xl">
                  Start Staking
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 md:w-96 md:h-96 bg-gradient-to-br from-corezero-purple to-corezero-accent rounded-2xl p-1">
                <div className="w-full h-full bg-background rounded-xl flex items-center justify-center p-6">
                  <div className="space-y-6 w-full">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold">CoreZero</span>
                      <div className="h-10 w-10 rounded-full bg-corezero-purple/20 flex items-center justify-center">
                        <span className="text-corezero-purple font-bold">C0</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="h-3 bg-gradient-to-r from-corezero-purple to-corezero-accent rounded-full"></div>
                      <div className="h-3 bg-muted rounded-full w-3/4"></div>
                      <div className="h-3 bg-muted rounded-full w-2/3"></div>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Value Locked</p>
                        <p className="text-2xl font-bold">$12.45M</p>
                      </div>
                      <Link to="/dashboard">
                        <Button size="sm" variant="outline" className="border-corezero-purple text-corezero-purple">
                          View Dashboard
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 p-4 bg-background border border-border rounded-lg shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-amber-500"></div>
                  <div>
                    <p className="text-sm font-medium">BTC-Backed</p>
                    <p className="text-xs text-muted-foreground">Satoshi+ Consensus</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 p-4 bg-background border border-border rounded-lg shadow-lg">
                <p className="text-xs text-muted-foreground">APY</p>
                <p className="text-lg font-bold text-green-500">12.8%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
