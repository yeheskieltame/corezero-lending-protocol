
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ConnectWallet from './ConnectWallet';

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-corezero-purple to-corezero-accent bg-clip-text text-transparent">
            CoreZero
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/dashboard" 
            className={`transition-colors ${isActive('/dashboard') ? 'text-corezero-purple' : 'hover:text-corezero-purple'}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/staking" 
            className={`transition-colors ${isActive('/staking') ? 'text-corezero-purple' : 'hover:text-corezero-purple'}`}
          >
            Staking
          </Link>
          <Link 
            to="/loans" 
            className={`transition-colors ${isActive('/loans') ? 'text-corezero-purple' : 'hover:text-corezero-purple'}`}
          >
            Loans
          </Link>
          <Link 
            to="/governance" 
            className={`transition-colors ${isActive('/governance') ? 'text-corezero-purple' : 'hover:text-corezero-purple'}`}
          >
            Governance
          </Link>
        </nav>

        <div className="hidden md:block">
          <ConnectWallet />
        </div>

        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-foreground">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link 
              to="/dashboard" 
              className={`py-2 transition-colors ${isActive('/dashboard') ? 'text-corezero-purple' : 'hover:text-corezero-purple'}`}
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/staking" 
              className={`py-2 transition-colors ${isActive('/staking') ? 'text-corezero-purple' : 'hover:text-corezero-purple'}`}
              onClick={() => setMenuOpen(false)}
            >
              Staking
            </Link>
            <Link 
              to="/loans" 
              className={`py-2 transition-colors ${isActive('/loans') ? 'text-corezero-purple' : 'hover:text-corezero-purple'}`}
              onClick={() => setMenuOpen(false)}
            >
              Loans
            </Link>
            <Link 
              to="/governance" 
              className={`py-2 transition-colors ${isActive('/governance') ? 'text-corezero-purple' : 'hover:text-corezero-purple'}`}
              onClick={() => setMenuOpen(false)}
            >
              Governance
            </Link>
            <ConnectWallet />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;
