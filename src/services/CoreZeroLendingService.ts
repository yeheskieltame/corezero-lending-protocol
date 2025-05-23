
import { ethers } from 'ethers';
import { CoreZeroLendingABI } from '../lib/abis/CoreZeroLendingABI';
import { CONTRACT_ADDRESSES } from '../lib/constants';

export enum LoanState {
  PENDING = 0,
  APPROVED = 1,
  ACTIVE = 2,
  REPAID = 3,
  DEFAULTED = 4
}

export interface LoanProposal {
  id: string;
  borrower: string;
  amount: string;
  term: number;
  revenueSharePercentage: string;
  projectName: string;
  projectDescription: string;
  reputationScore: number;
  votes: number;
  state: LoanState;
  createdAt: number;
  activatedAt: number;
  totalRepaid: string;
  formattedAmount: string;
  formattedRevenueShare: string;
  formattedTotalRepaid: string;
  progressPercentage: number;
}

class CoreZeroLendingService {
  private provider: ethers.providers.Web3Provider | null = null;
  private contract: ethers.Contract | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.contract = new ethers.Contract(
        CONTRACT_ADDRESSES.CORE_ZERO_LENDING,
        CoreZeroLendingABI,
        this.provider
      );
    }
  }

  private async getSigner() {
    if (!this.provider) throw new Error("Provider not initialized");
    return this.provider.getSigner();
  }

  // Create a loan proposal
  async createLoanProposal(
    amount: string, 
    term: number, 
    revenueSharePercentage: number, 
    projectName: string, 
    projectDescription: string
  ): Promise<string> {
    if (!this.contract) throw new Error("Contract not initialized");
    
    try {
      const signer = await this.getSigner();
      const amountWei = ethers.utils.parseEther(amount);
      const revenueShareBasisPoints = Math.floor(revenueSharePercentage * 100); // Convert to basis points (20% → 2000)
      
      const tx = await this.contract.connect(signer).createLoanProposal(
        amountWei,
        term,
        revenueShareBasisPoints,
        projectName,
        projectDescription
      );
      
      const receipt = await tx.wait();
      
      // Find the event with loan proposal id
      const event = receipt.events?.find(e => e.event === 'LoanProposalCreated');
      const loanId = event ? event.args.id.toString() : '0';
      
      return loanId;
    } catch (error) {
      console.error("Error creating loan proposal:", error);
      throw error;
    }
  }

  // Get loan proposal details
  async getLoanProposal(id: string): Promise<LoanProposal> {
    if (!this.contract) throw new Error("Contract not initialized");
    
    try {
      const proposal = await this.contract.getLoanProposal(id);
      const formattedAmount = ethers.utils.formatEther(proposal.amount);
      const formattedRevenueShare = (proposal.revenueSharePercentage.toNumber() / 100).toFixed(2) + '%';
      const formattedTotalRepaid = ethers.utils.formatEther(proposal.totalRepaid);
      
      // Calculate repayment progress percentage
      let progressPercentage = 0;
      if (proposal.amount.gt(0) && proposal.state === LoanState.ACTIVE) {
        progressPercentage = Math.min(
          100,
          Math.floor(proposal.totalRepaid.mul(100).div(proposal.amount).toNumber())
        );
      } else if (proposal.state === LoanState.REPAID) {
        progressPercentage = 100;
      }
      
      return {
        id: proposal.id.toString(),
        borrower: proposal.borrower,
        amount: proposal.amount.toString(),
        term: proposal.term.toNumber(),
        revenueSharePercentage: proposal.revenueSharePercentage.toString(),
        projectName: proposal.projectName,
        projectDescription: proposal.projectDescription,
        reputationScore: proposal.reputationScore.toNumber(),
        votes: proposal.votes.toNumber(),
        state: proposal.state,
        createdAt: proposal.createdAt.toNumber(),
        activatedAt: proposal.activatedAt.toNumber(),
        totalRepaid: proposal.totalRepaid.toString(),
        formattedAmount,
        formattedRevenueShare,
        formattedTotalRepaid,
        progressPercentage
      };
    } catch (error) {
      console.error("Error getting loan proposal:", error);
      throw error;
    }
  }

  // Repay loan
  async repayLoan(id: string, amount: string): Promise<boolean> {
    if (!this.contract) throw new Error("Contract not initialized");
    
    try {
      const signer = await this.getSigner();
      const amountWei = ethers.utils.parseEther(amount);
      
      const tx = await this.contract.connect(signer).repayLoan(id, amountWei);
      await tx.wait();
      
      return true;
    } catch (error) {
      console.error("Error repaying loan:", error);
      throw error;
    }
  }

  // Check if loan is in specific state
  async isLoanInState(id: string, state: LoanState): Promise<boolean> {
    if (!this.contract) throw new Error("Contract not initialized");
    
    try {
      return await this.contract.isLoanInState(id, state);
    } catch (error) {
      console.error("Error checking loan state:", error);
      throw error;
    }
  }
}

export const coreZeroLendingService = new CoreZeroLendingService();
