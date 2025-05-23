
import { ethers } from 'ethers';
import { RevenueOracleABI } from '../lib/abis/RevenueOracleABI';
import { CONTRACT_ADDRESSES } from '../lib/constants';

export interface RevenueData {
  timestamp: number;
  amount: string;
  formattedAmount: string;
  verified: boolean;
}

class RevenueOracleService {
  private provider: ethers.providers.Web3Provider | null = null;
  private contract: ethers.Contract | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.contract = new ethers.Contract(
        CONTRACT_ADDRESSES.REVENUE_ORACLE,
        RevenueOracleABI,
        this.provider
      );
    }
  }

  private async getSigner() {
    if (!this.provider) throw new Error("Provider not initialized");
    return this.provider.getSigner();
  }

  // Get latest verified revenue
  async getLatestVerifiedRevenue(projectId: string): Promise<{ amount: string; timestamp: number }> {
    if (!this.contract) throw new Error("Contract not initialized");
    
    try {
      const [amount, timestamp] = await this.contract.getLatestVerifiedRevenue(projectId);
      
      return {
        amount: ethers.utils.formatEther(amount),
        timestamp: timestamp.toNumber()
      };
    } catch (error) {
      console.error("Error getting latest verified revenue:", error);
      return { amount: '0', timestamp: 0 };
    }
  }

  // Get revenue history
  async getRevenueHistory(projectId: string, startIndex: number, count: number): Promise<RevenueData[]> {
    if (!this.contract) throw new Error("Contract not initialized");
    
    try {
      const historyData = await this.contract.getRevenueHistory(projectId, startIndex, count);
      
      return historyData.map(data => ({
        timestamp: data.timestamp.toNumber(),
        amount: data.amount.toString(),
        formattedAmount: ethers.utils.formatEther(data.amount),
        verified: data.verified
      }));
    } catch (error) {
      console.error("Error getting revenue history:", error);
      return [];
    }
  }

  // Report revenue
  async reportRevenue(projectId: string, amount: string): Promise<boolean> {
    if (!this.contract) throw new Error("Contract not initialized");
    
    try {
      const signer = await this.getSigner();
      const amountWei = ethers.utils.parseEther(amount);
      
      const tx = await this.contract.connect(signer).reportRevenue(projectId, amountWei);
      await tx.wait();
      
      return true;
    } catch (error) {
      console.error("Error reporting revenue:", error);
      throw error;
    }
  }

  // Verify revenue (for validators only)
  async verifyRevenue(projectId: string, amount: string, timestamp: number): Promise<boolean> {
    if (!this.contract) throw new Error("Contract not initialized");
    
    try {
      const signer = await this.getSigner();
      const amountWei = ethers.utils.parseEther(amount);
      
      const tx = await this.contract.connect(signer).verifyRevenue(projectId, amountWei, timestamp);
      await tx.wait();
      
      return true;
    } catch (error) {
      console.error("Error verifying revenue:", error);
      throw error;
    }
  }
}

export const revenueOracleService = new RevenueOracleService();
