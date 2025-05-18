
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border py-3">
      <div className="container flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-corezero-purple to-corezero-accent flex items-center justify-center mr-2">
              <span className="font-bold text-white">CZ</span>
            </div>
            <span className="text-xl font-bold text-gradient">CoreZero</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
          <div className="relative group">
            <button className="flex items-center text-sm font-medium hover:text-primary transition-colors">
              Developers <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            <div className="absolute left-0 mt-2 w-48 p-2 bg-card/90 backdrop-blur-sm rounded-md shadow-lg border border-border hidden group-hover:block animate-fade-in">
              <Link to="/apply" className="block px-4 py-2 text-sm hover:bg-muted rounded-md transition-colors">Apply for Loan</Link>
              <Link to="/projects" className="block px-4 py-2 text-sm hover:bg-muted rounded-md transition-colors">Showcase Projects</Link>
              <Link to="/docs" className="block px-4 py-2 text-sm hover:bg-muted rounded-md transition-colors">Documentation</Link>
            </div>
          </div>
          <div className="relative group">
            <button className="flex items-center text-sm font-medium hover:text-primary transition-colors">
              Lenders <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            <div className="absolute left-0 mt-2 w-48 p-2 bg-card/90 backdrop-blur-sm rounded-md shadow-lg border border-border hidden group-hover:block animate-fade-in">
              <Link to="/staking" className="block px-4 py-2 text-sm hover:bg-muted rounded-md transition-colors">Stake BTC/CORE</Link>
              <Link to="/portfolio" className="block px-4 py-2 text-sm hover:bg-muted rounded-md transition-colors">Portfolio</Link>
              <Link to="/governance" className="block px-4 py-2 text-sm hover:bg-muted rounded-md transition-colors">Governance</Link>
            </div>
          </div>
          <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">About</Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="outline" className="border-corezero-purple text-primary">Connect Wallet</Button>
          <Button className="bg-corezero-purple hover:bg-corezero-darkpurple text-white">Get Started</Button>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="p-2">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-card/95 backdrop-blur-md border-b border-border shadow-lg animate-fade-in">
          <div className="container py-4 space-y-4">
            <Link to="/" className="block py-2" onClick={toggleMenu}>Home</Link>
            <div>
              <p className="font-medium mb-2">Developers</p>
              <div className="pl-4 space-y-2">
                <Link to="/apply" className="block py-2 text-sm" onClick={toggleMenu}>Apply for Loan</Link>
                <Link to="/projects" className="block py-2 text-sm" onClick={toggleMenu}>Showcase Projects</Link>
                <Link to="/docs" className="block py-2 text-sm" onClick={toggleMenu}>Documentation</Link>
              </div>
            </div>
            <div>
              <p className="font-medium mb-2">Lenders</p>
              <div className="pl-4 space-y-2">
                <Link to="/staking" className="block py-2 text-sm" onClick={toggleMenu}>Stake BTC/CORE</Link>
                <Link to="/portfolio" className="block py-2 text-sm" onClick={toggleMenu}>Portfolio</Link>
                <Link to="/governance" className="block py-2 text-sm" onClick={toggleMenu}>Governance</Link>
              </div>
            </div>
            <Link to="/dashboard" className="block py-2" onClick={toggleMenu}>Dashboard</Link>
            <Link to="/about" className="block py-2" onClick={toggleMenu}>About</Link>
            <div className="flex flex-col space-y-2 pt-2">
              <Button variant="outline" className="border-corezero-purple text-primary w-full">Connect Wallet</Button>
              <Button className="bg-corezero-purple hover:bg-corezero-darkpurple text-white w-full">Get Started</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
