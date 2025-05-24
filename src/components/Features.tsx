
import React from 'react';
import { Link } from 'react-router-dom';
import Feature from './Feature';

const Features = () => {
  return (
    <section className="py-16 md:py-24 relative">
      <div className="absolute inset-0 bg-muted/30 -z-10"></div>
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">Core-Native</span> Financial Solutions
          </h2>
          <p className="text-lg text-muted-foreground">
            Enabling developers to build and scale with Core blockchain's unique capabilities
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link to="/staking">
            <Feature
              title="BTC Staking"
              description="Stake your BTC to earn stCORE rewards while contributing to Core's security and stability."
              icon="wallet"
              iconBgClass="bg-amber-400/10"
              iconTextClass="text-amber-500"
            />
          </Link>
          
          <Link to="/loans">
            <Feature
              title="Revenue-Based Funding"
              description="Get non-collateralized funding for Core ecosystem projects with revenue sharing."
              icon="chevron-up"
              iconBgClass="bg-purple-400/10"
              iconTextClass="text-purple-500"
            />
          </Link>
          
          <Link to="/governance">
            <Feature
              title="Decentralized Governance"
              description="Vote on CoreZero proposals, funding decisions, and protocol upgrades with stCORE."
              icon="layout-dashboard"
              iconBgClass="bg-cyan-400/10"
              iconTextClass="text-cyan-500"
            />
          </Link>
          
          <Link to="/dashboard">
            <Feature
              title="Revenue Oracle"
              description="Transparent and verifiable revenue tracking for funded projects using oracle technology."
              icon="layout-dashboard"
              iconBgClass="bg-green-400/10"
              iconTextClass="text-green-500"
            />
          </Link>
          
          <Link to="/dashboard">
            <Feature
              title="Reputation System"
              description="Developer reputation scoring that builds trust for uncollateralized lending."
              icon="settings"
              iconBgClass="bg-orange-400/10"
              iconTextClass="text-orange-500"
            />
          </Link>
          
          <Link to="/dashboard">
            <Feature
              title="Insurance Pool"
              description="BTC-backed insurance to protect lenders against defaults in the CoreZero ecosystem."
              icon="wallet"
              iconBgClass="bg-blue-400/10"
              iconTextClass="text-blue-500"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Features;
