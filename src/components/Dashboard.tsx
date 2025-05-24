import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import Chart from './Chart';
import InvestmentDashboard from './InvestmentDashboard';

const Dashboard = () => {
  return (
    <section className="py-10 md:py-16">
      <div className="container">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-muted-foreground">Monitor your loans and investments in the CoreZero platform.</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="loans">Loans</TabsTrigger>
            <TabsTrigger value="investments">Investments</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Value Locked</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$2,845,632</div>
                  <p className="text-xs text-muted-foreground mt-1">+5.25% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground mt-1">3 new this month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Revenue Shared</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$423,751</div>
                  <p className="text-xs text-muted-foreground mt-1">+12.3% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Average APY</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12.4%</div>
                  <p className="text-xs text-muted-foreground mt-1">+0.8% from last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Revenue vs. Repayments</CardTitle>
                  <CardDescription>Last 30 days</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <Chart />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Insurance Pool Health</CardTitle>
                  <CardDescription>Current pool status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">BTC Staked</div>
                      <div className="text-sm font-medium">82.5%</div>
                    </div>
                    <Progress value={82.5} className="h-2 bg-muted" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">stCORE Staked</div>
                      <div className="text-sm font-medium">65.3%</div>
                    </div>
                    <Progress value={65.3} className="h-2 bg-muted" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">Coverage Ratio</div>
                      <div className="text-sm font-medium">93.7%</div>
                    </div>
                    <Progress value={93.7} className="h-2 bg-muted" />
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-muted-foreground">Insurance pool health is excellent.</p>
                </CardFooter>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Loans</CardTitle>
                  <CardDescription>Last 5 loans issued</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Project Alpha {i}</p>
                          <p className="text-xs text-muted-foreground">2 days ago</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${(50000 + i * 10000).toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">12 months</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Projects</CardTitle>
                  <CardDescription>By revenue generated</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-corezero-purple to-corezero-accent flex items-center justify-center">
                            <span className="text-xs font-bold text-white">{i}</span>
                          </div>
                          <p className="font-medium">DeFi Protocol {i}</p>
                        </div>
                        <p className="font-medium">${(25000 - i * 3000).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Governance</CardTitle>
                  <CardDescription>Active proposals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4 rounded-lg border border-border">
                        <p className="font-medium mb-2">Proposal {100 + i}</p>
                        <p className="text-sm text-muted-foreground mb-3">
                          {i === 1 ? "Increase max loan amount to $250k" : 
                           i === 2 ? "Add support for dual staking rewards" : 
                           "Update revenue oracle verification mechanism"}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <span>Ends in {i * 2} days</span>
                          <span className={`px-2 py-1 rounded-full ${
                            i === 1 ? "bg-green-500/20 text-green-500" : 
                            i === 2 ? "bg-blue-500/20 text-blue-500" : 
                            "bg-orange-500/20 text-orange-500"
                          }`}>
                            {i === 1 ? "Passing" : i === 2 ? "Active" : "Close Vote"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="loans">
            <Card>
              <CardHeader>
                <CardTitle>Active Loans</CardTitle>
                <CardDescription>Manage your current loans</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8">Loan management features coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="investments">
            <InvestmentDashboard />
          </TabsContent>
          
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Project Management</CardTitle>
                <CardDescription>Monitor your project performance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8">Project management features coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Dashboard;
