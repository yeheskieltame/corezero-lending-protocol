
import React from 'react';
import Navigation from "@/components/Navigation";
import StakingInterface from "@/components/StakingInterface";
import Footer from "@/components/Footer";

const StakingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow mt-16">
        <StakingInterface />
      </main>
      <Footer />
    </div>
  );
};

export default StakingPage;
