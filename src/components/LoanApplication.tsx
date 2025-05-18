
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

const LoanApplication = () => {
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
            <Tabs defaultValue="project" className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="project">Project</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
                <TabsTrigger value="review">Review</TabsTrigger>
              </TabsList>
              
              <TabsContent value="project" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input id="project-name" placeholder="Enter your project name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-website">Website</Label>
                    <Input id="project-website" placeholder="https://" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="project-description">Project Description</Label>
                  <Textarea 
                    id="project-description" 
                    placeholder="Describe your project and its use case in the Core ecosystem"
                    className="min-h-[150px]"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-category">Category</Label>
                    <Input id="project-category" placeholder="DeFi, NFT, Gaming, etc." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-stage">Development Stage</Label>
                    <Input id="project-stage" placeholder="Concept, Alpha, Beta, Live" />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button className="w-full bg-corezero-purple">Continue to Financials</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="financials" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="loan-amount">Loan Amount (USD)</Label>
                    <Input id="loan-amount" placeholder="50,000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loan-term">Loan Term (Months)</Label>
                    <Input id="loan-term" placeholder="12" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Label>Revenue Share Percentage (20% recommended)</Label>
                  <Slider defaultValue={[20]} max={50} step={1} />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>5%</span>
                    <span>20%</span>
                    <span>50%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="revenue-model">Revenue Model</Label>
                  <Textarea 
                    id="revenue-model" 
                    placeholder="Describe how your project generates revenue"
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="funding-use">Use of Funds</Label>
                  <Textarea 
                    id="funding-use" 
                    placeholder="Explain how you plan to use the loan"
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="pt-4">
                  <Button className="w-full bg-corezero-purple">Continue to Technical</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="technical" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contract-address">Smart Contract Address</Label>
                  <Input id="contract-address" placeholder="0x..." />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="github-repo">GitHub Repository (optional)</Label>
                  <Input id="github-repo" placeholder="https://github.com/..." />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="technical-description">Technical Implementation</Label>
                  <Textarea 
                    id="technical-description" 
                    placeholder="Describe your technical implementation and Core integrations"
                    className="min-h-[150px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Core Integrations</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="btc-staking" className="accent-corezero-purple h-5 w-5" />
                      <Label htmlFor="btc-staking">BTC Staking</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="stcore" className="accent-corezero-purple h-5 w-5" />
                      <Label htmlFor="stcore">stCORE</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="dual-staking" className="accent-corezero-purple h-5 w-5" />
                      <Label htmlFor="dual-staking">Dual Staking</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="satoshi-plus" className="accent-corezero-purple h-5 w-5" />
                      <Label htmlFor="satoshi-plus">Satoshi Plus</Label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button className="w-full bg-corezero-purple">Continue to Review</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="review" className="space-y-4">
                <div className="rounded-lg border border-border p-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Project Information</h3>
                    <p className="font-medium">DeFi Protocol Alpha</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Loan Request</h3>
                    <p className="font-medium">$50,000 for 12 months with 20% revenue sharing</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Core Integrations</h3>
                    <p className="font-medium">BTC Staking, stCORE, Dual Staking</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="terms" className="accent-corezero-purple h-5 w-5" />
                    <Label htmlFor="terms">
                      I agree to the CoreZero <a href="#" className="text-corezero-purple underline">Terms of Service</a> and <a href="#" className="text-corezero-purple underline">Privacy Policy</a>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="oracle" className="accent-corezero-purple h-5 w-5" />
                    <Label htmlFor="oracle">
                      I agree to integrate the CoreZero Revenue Oracle into my project's smart contracts
                    </Label>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button className="w-full bg-corezero-purple">Submit Application</Button>
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
