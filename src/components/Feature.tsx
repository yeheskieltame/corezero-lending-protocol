
import React from 'react';
import { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';

interface FeatureProps {
  title: string;
  description: string;
  icon: string;
  iconBgClass?: string;
  iconTextClass?: string;
  delay?: string;
}

const Feature: React.FC<FeatureProps> = ({ 
  title, 
  description, 
  icon, 
  iconBgClass = 'bg-corezero-purple/20',
  iconTextClass = 'text-corezero-purple',
  delay = '0s' 
}) => {
  // Get the icon component from lucide-react
  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: LucideIcon } = {
      'wallet': Icons.Wallet,
      'chevron-up': Icons.ChevronUp,
      'layout-dashboard': Icons.LayoutDashboard,
      'settings': Icons.Settings,
    };
    
    const IconComponent = iconMap[iconName] || Icons.Circle;
    return <IconComponent size={24} />;
  };

  return (
    <div 
      className="rounded-xl p-6 glass-effect hover-scale animate-fade-in"
      style={{ animationDelay: delay }}
    >
      <div className={`w-12 h-12 rounded-lg ${iconBgClass} flex items-center justify-center mb-4 ${iconTextClass}`}>
        {getIcon(icon)}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Feature;
