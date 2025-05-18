
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const ProjectShowcase = () => {
  // Sample project data
  const projects = [
    {
      id: 1,
      name: "DeFi Protocol Alpha",
      description: "Decentralized lending and borrowing platform with Core-native BTC staking integration",
      logo: "A",
      category: "DeFi",
      fundingAmount: 120000,
      revenueShare: 15,
      progress: 68,
      color: "purple",
    },
    {
      id: 2,
      name: "BTCfi Vault",
      description: "Secure yield aggregator leveraging Core's dual staking mechanism",
      logo: "B",
      category: "Yield",
      fundingAmount: 85000,
      revenueShare: 20,
      progress: 32,
      color: "blue",
    },
    {
      id: 3,
      name: "CoreDAO Dashboard",
      description: "Analytics platform for Core ecosystem projects and governance",
      logo: "C",
      category: "Analytics",
      fundingAmount: 50000,
      revenueShare: 12,
      progress: 91,
      color: "cyan",
    },
    {
      id: 4,
      name: "Satoshi+ Bridge",
      description: "Cross-chain bridge secured by Core's Satoshi Plus consensus",
      logo: "S",
      category: "Infrastructure",
      fundingAmount: 200000,
      revenueShare: 18,
      progress: 45,
      color: "amber",
    },
    {
      id: 5,
      name: "CoreNFT Marketplace",
      description: "NFT platform with BTC native assets and stCORE rewards",
      logo: "N",
      category: "NFT",
      fundingAmount: 75000,
      revenueShare: 15,
      progress: 76,
      color: "pink",
    },
    {
      id: 6,
      name: "Bitcoin Launchpad",
      description: "IDO platform for Core ecosystem projects with BTC staking integration",
      logo: "L",
      category: "Launchpad",
      fundingAmount: 150000,
      revenueShare: 25,
      progress: 54,
      color: "orange",
    }
  ];

  // Helper function to get logo background color based on the color property
  const getLogoColor = (color: string) => {
    switch(color) {
      case "purple": return "bg-corezero-purple";
      case "blue": return "bg-corezero-accent";
      case "cyan": return "bg-cyan-600";
      case "amber": return "bg-amber-600";
      case "pink": return "bg-pink-600";
      case "orange": return "bg-orange-600";
      default: return "bg-corezero-purple";
    }
  };

  return (
    <section className="py-16 relative">
      <div className="absolute top-1/2 left-0 right-0 w-full h-[500px] bg-gradient-to-b from-corezero-purple/5 to-transparent -z-10"></div>
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Funded <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover innovative blockchain projects built on Core ecosystem and funded through CoreZero.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Card key={project.id} className="hover-scale animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div className={`w-10 h-10 rounded-lg ${getLogoColor(project.color)} flex items-center justify-center text-white font-bold`}>
                    {project.logo}
                  </div>
                  <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                    {project.category}
                  </span>
                </div>
                <CardTitle className="text-xl">{project.name}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Funding Amount</p>
                    <p className="font-medium">${project.fundingAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue Share</p>
                    <p className="font-medium">{project.revenueShare}%</p>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Loan Repayment</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="outline" className="border-corezero-purple text-corezero-purple">View All Projects</Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectShowcase;
