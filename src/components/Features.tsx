
import React from 'react';
import Feature from './Feature';
import { Wallet, PieChart, Shield, Code, CreditCard, Users } from 'lucide-react';

const Features = () => {
  return (
    <section className="py-16 md:py-24 relative">
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-corezero-accent/5 rounded-full blur-3xl -z-10"></div>
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Core-Native <span className="text-gradient">Features</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            CoreZero leverages Core's unique infrastructure to provide a seamless lending experience for both 
            developers and lenders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <Feature 
            title="BTC-Backed Insurance Pool" 
            description="Stake BTC through Core's non-custodial BTC staking to provide loan protection while earning additional yield."
            icon={<Shield className="h-6 w-6" />}
            delay="0.1s"
          />
          <Feature 
            title="Satoshi Plus Scoring" 
            description="Leverage Core's Satoshi Plus consensus mechanism to assess borrower creditworthiness and project viability."
            icon={<PieChart className="h-6 w-6" />}
            delay="0.2s"
          />
          <Feature 
            title="Revenue Oracle" 
            description="Core-native oracle that tracks project revenue in real-time to ensure transparent and automatic revenue sharing."
            icon={<Code className="h-6 w-6" />}
            delay="0.3s"
          />
          <Feature 
            title="stCORE Governance" 
            description="Use stCORE tokens to participate in loan approval voting and platform governance decisions."
            icon={<Users className="h-6 w-6" />}
            delay="0.4s"
          />
          <Feature 
            title="Dual Staking Mechanism" 
            description="Enhanced yield generation through Core's dual staking, providing better protection for lenders."
            icon={<Wallet className="h-6 w-6" />}
            delay="0.5s"
          />
          <Feature 
            title="Protocol-Embedded Revenue Sharing" 
            description="Automatic revenue sharing between developers and lenders embedded directly in smart contracts."
            icon={<CreditCard className="h-6 w-6" />}
            delay="0.6s"
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
