
import { ethers, parseEther, formatEther, Contract } from 'ethers';
import { CoreZeroLendingABI } from '../lib/abis/CoreZeroLendingABI';
import { CONTRACT_ADDRESSES } from '../lib/constants';

export interface LoanProposal {
  id: number;
  borrower: string;
  amount: string;
  term: number;
  revenueSharePercentage: number;
  projectName: string;
  projectDescription: string;
  reputationScore: number;
  votes: number;
  state: number;
  createdAt: number;
  activatedAt: number;
  totalRepaid: string;
}

class CoreZeroLendingService {
  private provider: ethers.BrowserProvider | null = null;
  private contract: Contract | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.contract = new ethers.Contract(
        CONTRACT_ADDRESSES.CORE_ZERO_LENDING,
        CoreZeroLendingABI,
        this.provider
      );
    }
  }

  // Create a loan proposal
  async createLoanProposal(
    amount: string,
    term: number,
    revenueSharePercentage: number,
    projectName: string,
    projectDescription: string
  ): Promise<number> {
    if (!this.contract || !this.provider) {
      throw new Error("Contract not initialized");
    }

    try {
      const signer = await this.provider.getSigner();
      const amountWei = parseEther(amount);

      const contractWithSigner = this.contract.connect(signer) as Contract;
      const createTx = await contractWithSigner.createLoanProposal(
        amountWei,
        term,
        revenueSharePercentage,
        projectName,
        projectDescription
      );
      const receipt = await createTx.wait();

      // Extract loan ID from events
      const loanId = receipt.logs[0]?.topics[1] || 0;
      return Number(loanId);
    } catch (error) {
      console.error("Error creating loan proposal:", error);
      throw error;
    }
  }

  // Get loan proposal details
  async getLoanProposal(id: number): Promise<LoanProposal | null> {
    if (!this.contract) throw new Error("Contract not initialized");

    try {
      const proposal = await this.contract.getLoanProposal(id);
      
      return {
        id: Number(proposal.id),
        borrower: proposal.borrower,
        amount: formatEther(proposal.amount),
        term: Number(proposal.term),
        revenueSharePercentage: Number(proposal.revenueSharePercentage),
        projectName: proposal.projectName,
        projectDescription: proposal.projectDescription,
        reputationScore: Number(proposal.reputationScore),
        votes: Number(proposal.votes),
        state: Number(proposal.state),
        createdAt: Number(proposal.createdAt),
        activatedAt: Number(proposal.activatedAt),
        totalRepaid: formatEther(proposal.totalRepaid)
      };
    } catch (error) {
      console.error("Error getting loan proposal:", error);
      return null;
    }
  }

  // Repay loan
  async repayLoan(id: number, amount: string): Promise<boolean> {
    if (!this.contract || !this.provider) {
      throw new Error("Contract not initialized");
    }

    try {
      const signer = await this.provider.getSigner();
      const amountWei = parseEther(amount);

      const contractWithSigner = this.contract.connect(signer) as Contract;
      const repayTx = await contractWithSigner.repayLoan(id, amountWei);
      await repayTx.wait();

      return true;
    } catch (error) {
      console.error("Error repaying loan:", error);
      throw error;
    }
  }

  // Activate loan
  async activateLoan(id: number): Promise<boolean> {
    if (!this.contract || !this.provider) {
      throw new Error("Contract not initialized");
    }

    try {
      const signer = await this.provider.getSigner();
      const contractWithSigner = this.contract.connect(signer) as Contract;
      const activateTx = await contractWithSigner.activateLoan(id);
      await activateTx.wait();

      return true;
    } catch (error) {
      console.error("Error activating loan:", error);
      throw error;
    }
  }
}

export const coreZeroLendingService = new CoreZeroLendingService();
