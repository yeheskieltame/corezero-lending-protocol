
import React from 'react';

interface FeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: string;
}

const Feature: React.FC<FeatureProps> = ({ title, description, icon, delay = '0s' }) => {
  return (
    <div 
      className="rounded-xl p-6 glass-effect hover-scale animate-fade-in"
      style={{ animationDelay: delay }}
    >
      <div className="w-12 h-12 rounded-lg bg-corezero-purple/20 flex items-center justify-center mb-4 text-corezero-purple">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Feature;
