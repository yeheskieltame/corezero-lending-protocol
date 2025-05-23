
import { ethers } from 'ethers';
import { ReputationSystemABI } from '../lib/abis/ReputationSystemABI';
import { CONTRACT_ADDRESSES } from '../lib/constants';

class ReputationSystemService {
  private provider: ethers.providers.Web3Provider | null = null;
  private contract: ethers.Contract | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.contract = new ethers.Contract(
        CONTRACT_ADDRESSES.REPUTATION_SYSTEM,
        ReputationSystemABI,
        this.provider
      );
    }
  }

  // Get reputation score for a borrower
  async getReputationScore(address: string): Promise<number> {
    if (!this.contract) throw new Error("Contract not initialized");
    
    try {
      const score = await this.contract.getReputationScore(address);
      return score.toNumber();
    } catch (error) {
      console.error("Error getting reputation score:", error);
      // Return default score if there's an error
      return 50;
    }
  }

  // Check if a borrower is blacklisted
  async isBlacklisted(address: string): Promise<boolean> {
    if (!this.contract) throw new Error("Contract not initialized");
    
    try {
      return await this.contract.isBlacklisted(address);
    } catch (error) {
      console.error("Error checking blacklist status:", error);
      return false;
    }
  }

  // Get minimum reputation score required for a loan
  async getMinimumReputationScoreForLoan(amount: string, term: number): Promise<number> {
    if (!this.contract) throw new Error("Contract not initialized");
    
    try {
      const amountWei = ethers.utils.parseEther(amount);
      const minScore = await this.contract.getMinimumReputationScoreForLoan(amountWei, term);
      return minScore.toNumber();
    } catch (error) {
      console.error("Error getting minimum reputation score:", error);
      // Return a fallback value
      return 50;
    }
  }
}

export const reputationSystemService = new ReputationSystemService();
