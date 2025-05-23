
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateAddress(address: string, startChars = 6, endChars = 4): string {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

export function formatCurrency(amount: number | string, maximumFractionDigits = 2): string {
  const parsedAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(parsedAmount)) return '$0.00';
  
  return parsedAmount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits
  });
}

export function formatNumber(number: number | string, maximumFractionDigits = 2): string {
  const parsedNumber = typeof number === 'string' ? parseFloat(number) : number;
  
  if (isNaN(parsedNumber)) return '0';
  
  return parsedNumber.toLocaleString('en-US', {
    maximumFractionDigits
  });
}

export function formatPercentage(percentage: number | string): string {
  const parsedPercentage = typeof percentage === 'string' ? parseFloat(percentage) : percentage;
  
  if (isNaN(parsedPercentage)) return '0%';
  
  return `${parsedPercentage.toFixed(2)}%`;
}

export function getRelativeTime(timestamp: number): string {
  if (!timestamp) return 'N/A';
  
  const now = Date.now();
  const diff = now - timestamp * 1000;
  const seconds = Math.floor(diff / 1000);
  
  if (seconds < 60) return 'Just now';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
  
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
  
  const years = Math.floor(months / 12);
  return `${years} year${years !== 1 ? 's' : ''} ago`;
}
