
import React from 'react';
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Dashboard from "@/components/Dashboard";
import LoanApplication from "@/components/LoanApplication";
import StakingInterface from "@/components/StakingInterface";
import ProjectShowcase from "@/components/ProjectShowcase";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow mt-16">
        <Hero />
        <Features />
        <Dashboard />
        <ProjectShowcase />
        <LoanApplication />
        <StakingInterface />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
