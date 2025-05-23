
import React from 'react';
import Navigation from "@/components/Navigation";
import LoanApplication from "@/components/LoanApplication";
import ProjectShowcase from "@/components/ProjectShowcase";
import Footer from "@/components/Footer";

const LoansPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow mt-16">
        <ProjectShowcase />
        <LoanApplication />
      </main>
      <Footer />
    </div>
  );
};

export default LoansPage;
