
import React from 'react';
import Navigation from "@/components/Navigation";
import Dashboard from "@/components/Dashboard";
import Footer from "@/components/Footer";

const DashboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow mt-16">
        <Dashboard />
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;
