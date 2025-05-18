
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 md:pt-28 md:pb-20 lg:pt-32 lg:pb-24">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-hero-pattern z-0"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-corezero-purple/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-60 h-60 bg-corezero-accent/10 rounded-full blur-3xl"></div>
      
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-block px-3 py-1 rounded-full bg-corezero-purple/10 border border-corezero-purple/20 text-corezero-purple text-sm font-medium mb-4 animate-fade-in">
            Core Connect Global Buildathon
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="text-gradient">Uncollateralized</span> Developer Loans with Core-Native Revenue Sharing
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Empowering blockchain developers on the Core ecosystem with access to funding without traditional collateral, 
            secured through innovative BTC-backed insurance pools and protocol-embedded revenue sharing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button asChild size="lg" className="bg-corezero-purple hover:bg-corezero-darkpurple text-white">
              <Link to="/apply">Apply for Funding <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-corezero-purple">
              <Link to="/staking">Stake BTC/CORE</Link>
            </Button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="px-4 py-6 rounded-lg glass-effect text-center hover-scale">
            <p className="font-medium mb-2 text-muted-foreground text-sm">Total TVL</p>
            <p className="text-2xl sm:text-3xl font-bold text-gradient">$2.8M</p>
          </div>
          <div className="px-4 py-6 rounded-lg glass-effect text-center hover-scale">
            <p className="font-medium mb-2 text-muted-foreground text-sm">Active Loans</p>
            <p className="text-2xl sm:text-3xl font-bold text-gradient">24</p>
          </div>
          <div className="px-4 py-6 rounded-lg glass-effect text-center hover-scale">
            <p className="font-medium mb-2 text-muted-foreground text-sm">Funded Projects</p>
            <p className="text-2xl sm:text-3xl font-bold text-gradient">16</p>
          </div>
          <div className="px-4 py-6 rounded-lg glass-effect text-center hover-scale">
            <p className="font-medium mb-2 text-muted-foreground text-sm">Avg. APY</p>
            <p className="text-2xl sm:text-3xl font-bold text-gradient">12.4%</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
