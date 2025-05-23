
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { coreZeroLendingService } from '@/services/CoreZeroLendingService';
import { revenueOracleService } from '@/services/RevenueOracleService';
import { useWallet } from '@/hooks/useWallet';
import { toast } from '@/hooks/use-toast';

const ProjectShowcase = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isConnected } = useWallet();

  // Colors for project logos
  const colors = ["purple", "blue", "cyan", "amber", "pink", "orange"];

  useEffect(() => {
    const fetchActiveProjects = async () => {
      setLoading(true);
      try {
        // In a real application, we would fetch actual projects from the blockchain
        // This is a simplified version for demo purposes
        const projectsData = [];
        
        // Let's assume we can fetch up to 10 projects
        for (let i = 1; i <= 6; i++) {
          try {
            const projectData = await coreZeroLendingService.getLoanProposal(i);
            
            if (projectData && projectData.state === 2) { // Assuming state 2 is "Active"
              // Get revenue data from oracle
              const revenueData = await revenueOracleService.getLatestVerifiedRevenue(i);
              
              // Calculate repayment progress
              const totalRepaid = parseFloat(projectData.totalRepaid);
              const amount = parseFloat(projectData.amount);
              const progress = amount > 0 ? (totalRepaid / amount) * 100 : 0;
              
              projectsData.push({
                id: projectData.id,
                name: projectData.projectName,
                description: projectData.projectDescription,
                logo: projectData.projectName.charAt(0), // Use first letter as logo
                category: i % 2 === 0 ? "DeFi" : i % 3 === 0 ? "Infrastructure" : "Yield",
                fundingAmount: amount,
                revenueShare: projectData.revenueSharePercentage,
                progress: Math.min(Math.round(progress), 100),
                color: colors[i % colors.length],
                borrower: projectData.borrower
              });
              
              if (projectsData.length >= 6) break; // Limit to 6 projects for now
            }
          } catch (error) {
            console.error(`Error fetching project ${i}:`, error);
            // Continue to next project
          }
        }
        
        // If no projects are found or there's an error, use fallback data
        if (projectsData.length === 0) {
          projectsData.push(
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
            }
          );
        }
        
        setProjects(projectsData);
      } catch (error) {
        console.error("Error loading projects:", error);
        toast({
          title: "Error loading projects",
          description: "Failed to load project data. Please try again.",
          variant: "destructive",
        });
        
        // Fallback data
        setProjects([
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
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchActiveProjects();
  }, []);

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

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-corezero-purple"></div>
          </div>
        ) : (
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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      toast({
                        title: "Project Details",
                        description: `View complete details for ${project.name}`,
                      });
                    }}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link to="/loans">
            <Button variant="outline" className="border-corezero-purple text-corezero-purple">View All Projects</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectShowcase;
