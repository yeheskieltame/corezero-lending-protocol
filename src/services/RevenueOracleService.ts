
import { ethers, parseEther, formatEther, Contract } from 'ethers';
import { RevenueOracleABI } from '../lib/abis/RevenueOracleABI';
import { CONTRACT_ADDRESSES } from '../lib/constants';

export interface RevenueData {
  timestamp: number;
  amount: string;
  verified: boolean;
}

class RevenueOracleService {
  private provider: ethers.BrowserProvider | null = null;
  private contract: Contract | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.contract = new ethers.Contract(
        CONTRACT_ADDRESSES.REVENUE_ORACLE,
        RevenueOracleABI,
        this.provider
      );
    }
  }

  // Get latest verified revenue for a project
  async getLatestVerifiedRevenue(projectId: number): Promise<{amount: string, timestamp: number}> {
    if (!this.contract) throw new Error("Contract not initialized");
    
    try {
      const result = await this.contract.getLatestVerifiedRevenue(projectId);
      return {
        amount: formatEther(result.amount || result[0]),
        timestamp: Number(result.timestamp || result[1])
      };
    } catch (error) {
      console.error("Error getting latest verified revenue:", error);
      return { amount: "0", timestamp: 0 };
    }
  }

  // Get revenue history for a project
  async getRevenueHistory(projectId: number, startIndex: number = 0, count: number = 10): Promise<RevenueData[]> {
    if (!this.contract) throw new Error("Contract not initialized");
    
    try {
      const history = await this.contract.getRevenueHistory(projectId, startIndex, count);
      return history.map((item: any) => ({
        timestamp: Number(item.timestamp),
        amount: formatEther(item.amount),
        verified: Boolean(item.verified)
      }));
    } catch (error) {
      console.error("Error getting revenue history:", error);
      return [];
    }
  }

  // Report revenue for a project
  async reportRevenue(projectId: number, amount: string): Promise<boolean> {
    if (!this.contract || !this.provider) {
      throw new Error("Contract not initialized");
    }

    try {
      const signer = await this.provider.getSigner();
      const amountWei = parseEther(amount);

      const contractWithSigner = this.contract.connect(signer) as Contract;
      const reportTx = await contractWithSigner.reportRevenue(projectId, amountWei);
      await reportTx.wait();

      return true;
    } catch (error) {
      console.error("Error reporting revenue:", error);
      throw error;
    }
  }

  // Verify revenue (for validators)
  async verifyRevenue(projectId: number, amount: string, timestamp: number): Promise<boolean> {
    if (!this.contract || !this.provider) {
      throw new Error("Contract not initialized");
    }

    try {
      const signer = await this.provider.getSigner();
      const amountWei = parseEther(amount);

      const contractWithSigner = this.contract.connect(signer) as Contract;
      const verifyTx = await contractWithSigner.verifyRevenue(projectId, amountWei, timestamp);
      await verifyTx.wait();

      return true;
    } catch (error) {
      console.error("Error verifying revenue:", error);
      throw error;
    }
  }
}

export const revenueOracleService = new RevenueOracleService();
