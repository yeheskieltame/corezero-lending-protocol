
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useWallet } from "@/hooks/useWallet";
import { coreZeroLendingService } from "@/services/CoreZeroLendingService";
import { toast } from "@/hooks/use-toast";

const LoanApplication = () => {
  const { isConnected, address } = useWallet();
  const [activeTab, setActiveTab] = useState("project");
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    projectName: '',
    projectWebsite: '',
    projectDescription: '',
    projectCategory: '',
    projectStage: '',
    loanAmount: '',
    loanTerm: '',
    revenueShare: 20,
    revenueModel: '',
    fundingUse: '',
    contractAddress: '',
    githubRepo: '',
    technicalDescription: '',
    integrations: {
      btcStaking: false,
      stCORE: false,
      dualStaking: false,
      satoshiPlus: false
    },
    terms: false,
    oracle: false
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;
    
    if (id === 'terms' || id === 'oracle') {
      setFormData({
        ...formData,
        [id]: checked
      });
    } else {
      setFormData({
        ...formData,
        integrations: {
          ...formData.integrations,
          [id]: checked
        }
      });
    }
  };

  const handleSliderChange = (value) => {
    setFormData({
      ...formData,
      revenueShare: value[0]
    });
  };

  const handleContinue = (nextTab) => {
    setActiveTab(nextTab);
  };

  const handleSubmit = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to submit an application.",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.terms || !formData.oracle) {
      toast({
        title: "Terms not accepted",
        description: "Please accept all terms to continue.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const amount = formData.loanAmount.replace(/,/g, ''); // Remove commas if present
      const term = parseInt(formData.loanTerm);
      
      // Create loan proposal
      const loanId = await coreZeroLendingService.createLoanProposal(
        amount, 
        term, 
        formData.revenueShare, 
        formData.projectName,
        formData.projectDescription
      );
      
      toast({
        title: "Application submitted successfully!",
        description: `Your loan proposal #${loanId} has been created and will be reviewed.`,
      });
      
      // Reset form
      setFormData({
        projectName: '',
        projectWebsite: '',
        projectDescription: '',
        projectCategory: '',
        projectStage: '',
        loanAmount: '',
        loanTerm: '',
        revenueShare: 20,
        revenueModel: '',
        fundingUse: '',
        contractAddress: '',
        githubRepo: '',
        technicalDescription: '',
        integrations: {
          btcStaking: false,
          stCORE: false,
          dualStaking: false,
          satoshiPlus: false
        },
        terms: false,
        oracle: false
      });
      
      setActiveTab("project");
    } catch (error) {
      console.error("Error submitting loan application:", error);
      toast({
        title: "Application submission failed",
        description: "Please check your inputs and try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 relative">
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-corezero-purple/5 rounded-full blur-3xl -z-10"></div>
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Apply for <span className="text-gradient">Developer Funding</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Get uncollateralized funding for your Core blockchain project by sharing future revenue instead of providing traditional collateral.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Loan Application</CardTitle>
            <CardDescription>
              Complete all steps to submit your application for review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="project">Project</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
                <TabsTrigger value="review">Review</TabsTrigger>
              </TabsList>
              
              <TabsContent value="project" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectName">Project Name</Label>
                    <Input 
                      id="projectName" 
                      placeholder="Enter your project name" 
                      value={formData.projectName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectWebsite">Website</Label>
                    <Input 
                      id="projectWebsite" 
                      placeholder="https://" 
                      value={formData.projectWebsite}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="projectDescription">Project Description</Label>
                  <Textarea 
                    id="projectDescription" 
                    placeholder="Describe your project and its use case in the Core ecosystem"
                    className="min-h-[150px]"
                    value={formData.projectDescription}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectCategory">Category</Label>
                    <Input 
                      id="projectCategory" 
                      placeholder="DeFi, NFT, Gaming, etc." 
                      value={formData.projectCategory}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectStage">Development Stage</Label>
                    <Input 
                      id="projectStage" 
                      placeholder="Concept, Alpha, Beta, Live" 
                      value={formData.projectStage}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    className="w-full bg-corezero-purple" 
                    onClick={() => handleContinue("financials")}
                  >
                    Continue to Financials
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="financials" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="loanAmount">Loan Amount (USD)</Label>
                    <Input 
                      id="loanAmount" 
                      placeholder="50,000" 
                      value={formData.loanAmount}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loanTerm">Loan Term (Months)</Label>
                    <Input 
                      id="loanTerm" 
                      placeholder="12" 
                      value={formData.loanTerm}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Label>Revenue Share Percentage ({formData.revenueShare}%)</Label>
                  <Slider 
                    value={[formData.revenueShare]} 
                    min={5}
                    max={50} 
                    step={1} 
                    onValueChange={handleSliderChange}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>5%</span>
                    <span>20%</span>
                    <span>50%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="revenueModel">Revenue Model</Label>
                  <Textarea 
                    id="revenueModel" 
                    placeholder="Describe how your project generates revenue"
                    className="min-h-[100px]"
                    value={formData.revenueModel}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fundingUse">Use of Funds</Label>
                  <Textarea 
                    id="fundingUse" 
                    placeholder="Explain how you plan to use the loan"
                    className="min-h-[100px]"
                    value={formData.fundingUse}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="pt-4">
                  <Button 
                    className="w-full bg-corezero-purple"
                    onClick={() => handleContinue("technical")}
                  >
                    Continue to Technical
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="technical" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contractAddress">Smart Contract Address</Label>
                  <Input 
                    id="contractAddress" 
                    placeholder="0x..." 
                    value={formData.contractAddress}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="githubRepo">GitHub Repository (optional)</Label>
                  <Input 
                    id="githubRepo" 
                    placeholder="https://github.com/..." 
                    value={formData.githubRepo}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="technicalDescription">Technical Implementation</Label>
                  <Textarea 
                    id="technicalDescription" 
                    placeholder="Describe your technical implementation and Core integrations"
                    className="min-h-[150px]"
                    value={formData.technicalDescription}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Core Integrations</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="btcStaking" 
                        className="accent-corezero-purple h-5 w-5" 
                        checked={formData.integrations.btcStaking}
                        onChange={handleCheckboxChange}
                      />
                      <Label htmlFor="btcStaking">BTC Staking</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="stCORE" 
                        className="accent-corezero-purple h-5 w-5" 
                        checked={formData.integrations.stCORE}
                        onChange={handleCheckboxChange}
                      />
                      <Label htmlFor="stCORE">stCORE</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="dualStaking" 
                        className="accent-corezero-purple h-5 w-5" 
                        checked={formData.integrations.dualStaking}
                        onChange={handleCheckboxChange}
                      />
                      <Label htmlFor="dualStaking">Dual Staking</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="satoshiPlus" 
                        className="accent-corezero-purple h-5 w-5" 
                        checked={formData.integrations.satoshiPlus}
                        onChange={handleCheckboxChange}
                      />
                      <Label htmlFor="satoshiPlus">Satoshi Plus</Label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    className="w-full bg-corezero-purple"
                    onClick={() => handleContinue("review")}
                  >
                    Continue to Review
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="review" className="space-y-4">
                <div className="rounded-lg border border-border p-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Project Information</h3>
                    <p className="font-medium">{formData.projectName || "Project name not provided"}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Loan Request</h3>
                    <p className="font-medium">
                      ${formData.loanAmount || "0"} for {formData.loanTerm || "0"} months with {formData.revenueShare}% revenue sharing
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Core Integrations</h3>
                    <p className="font-medium">
                      {Object.entries(formData.integrations)
                        .filter(([_, checked]) => checked)
                        .map(([key]) => 
                          key === 'btcStaking' ? 'BTC Staking' : 
                          key === 'stCORE' ? 'stCORE' : 
                          key === 'dualStaking' ? 'Dual Staking' : 'Satoshi Plus'
                        )
                        .join(', ') || "None selected"}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="terms" 
                      className="accent-corezero-purple h-5 w-5" 
                      checked={formData.terms}
                      onChange={handleCheckboxChange}
                    />
                    <Label htmlFor="terms">
                      I agree to the CoreZero <a href="#" className="text-corezero-purple underline">Terms of Service</a> and <a href="#" className="text-corezero-purple underline">Privacy Policy</a>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="oracle" 
                      className="accent-corezero-purple h-5 w-5" 
                      checked={formData.oracle}
                      onChange={handleCheckboxChange}
                    />
                    <Label htmlFor="oracle">
                      I agree to integrate the CoreZero Revenue Oracle into my project's smart contracts
                    </Label>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    className="w-full bg-corezero-purple"
                    disabled={loading || !isConnected || !formData.terms || !formData.oracle}
                    onClick={handleSubmit}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : 'Submit Application'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">Applications are reviewed within 3-5 business days</p>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
};

export default LoanApplication;
