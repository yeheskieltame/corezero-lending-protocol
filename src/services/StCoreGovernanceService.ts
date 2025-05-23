
import { ethers, parseEther, formatEther, Contract } from 'ethers';
import { StCoreGovernanceABI } from '../lib/abis/StCoreGovernanceABI';
import { TokenABI } from '../lib/abis/TokenABI';
import { CONTRACT_ADDRESSES } from '../lib/constants';

export enum ProposalState {
  Pending = 0,
  Active = 1,
  Canceled = 2,
  Defeated = 3,
  Succeeded = 4,
  Queued = 5,
  Expired = 6,
  Executed = 7
}

export interface ProposalDetails {
  id: number;
  proposer: string;
  description: string;
  startBlock: number;
  endBlock: number;
  forVotes: string;
  againstVotes: string;
  canceled: boolean;
  executed: boolean;
}

export interface VoteReceipt {
  hasVoted: boolean;
  support: boolean;
  votes: string;
}

class StCoreGovernanceService {
  private provider: ethers.BrowserProvider | null = null;
  private contract: Contract | null = null;
  private stCoreTokenContract: Contract | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.contract = new ethers.Contract(
        CONTRACT_ADDRESSES.STCORE_GOVERNANCE,
        StCoreGovernanceABI,
        this.provider
      );
      this.stCoreTokenContract = new ethers.Contract(
        CONTRACT_ADDRESSES.STCORE_TOKEN,
        TokenABI,
        this.provider
      );
    }
  }

  // Get proposal details
  async getProposalDetails(proposalId: number): Promise<ProposalDetails | null> {
    if (!this.contract) throw new Error("Contract not initialized");
    
    try {
      const details = await this.contract.getProposalDetails(proposalId);
      return {
        id: Number(details.id || details[0]),
        proposer: details.proposer || details[1],
        description: details.description || details[2],
        startBlock: Number(details.startBlock || details[3]),
        endBlock: Number(details.endBlock || details[4]),
        forVotes: formatEther(details.forVotes || details[5]),
        againstVotes: formatEther(details.againstVotes || details[6]),
        canceled: Boolean(details.canceled || details[7]),
        executed: Boolean(details.executed || details[8])
      };
    } catch (error) {
      console.error("Error getting proposal details:", error);
      return null;
    }
  }

  // Get proposal state
  async getProposalState(proposalId: number): Promise<ProposalState> {
    if (!this.contract) throw new Error("Contract not initialized");
    
    try {
      const state = await this.contract.getProposalState(proposalId);
      return Number(state);
    } catch (error) {
      console.error("Error getting proposal state:", error);
      return ProposalState.Pending;
    }
  }

  // Create loan proposal
  async createLoanProposal(loanId: number, description: string): Promise<number> {
    if (!this.contract || !this.provider) {
      throw new Error("Contract not initialized");
    }

    try {
      const signer = await this.provider.getSigner();
      const contractWithSigner = this.contract.connect(signer) as Contract;
      const createTx = await contractWithSigner.createLoanProposal(loanId, description);
      const receipt = await createTx.wait();

      // Extract proposal ID from events
      const proposalId = receipt.logs[0]?.topics[1] || 0;
      return Number(proposalId);
    } catch (error) {
      console.error("Error creating loan proposal:", error);
      throw error;
    }
  }

  // Cast vote on proposal
  async castVote(proposalId: number, support: boolean): Promise<string> {
    if (!this.contract || !this.provider) {
      throw new Error("Contract not initialized");
    }

    try {
      const signer = await this.provider.getSigner();
      const contractWithSigner = this.contract.connect(signer) as Contract;
      const voteTx = await contractWithSigner.castVote(proposalId, support);
      const receipt = await voteTx.wait();

      const votesWei = receipt.logs[0]?.data || "0";
      return formatEther(votesWei);
    } catch (error) {
      console.error("Error casting vote:", error);
      throw error;
    }
  }

  // Execute proposal
  async executeProposal(proposalId: number): Promise<boolean> {
    if (!this.contract || !this.provider) {
      throw new Error("Contract not initialized");
    }

    try {
      const signer = await this.provider.getSigner();
      const contractWithSigner = this.contract.connect(signer) as Contract;
      const executeTx = await contractWithSigner.executeProposal(proposalId);
      await executeTx.wait();

      return true;
    } catch (error) {
      console.error("Error executing proposal:", error);
      throw error;
    }
  }

  // Get voting power for an account
  async getVotingPower(account: string): Promise<string> {
    if (!this.contract) throw new Error("Contract not initialized");
    
    try {
      const votingPower = await this.contract.getVotingPower(account);
      return formatEther(votingPower);
    } catch (error) {
      console.error("Error getting voting power:", error);
      return "0";
    }
  }

  // Stake tokens for governance
  async stakeTokens(amount: string): Promise<boolean> {
    if (!this.contract || !this.stCoreTokenContract || !this.provider) {
      throw new Error("Contract not initialized");
    }

    try {
      const signer = await this.provider.getSigner();
      const amountWei = parseEther(amount);

      // Approve tokens first
      const tokenWithSigner = this.stCoreTokenContract.connect(signer) as Contract;
      const approveTx = await tokenWithSigner.approve(CONTRACT_ADDRESSES.STCORE_GOVERNANCE, amountWei);
      await approveTx.wait();

      // Stake tokens
      const contractWithSigner = this.contract.connect(signer) as Contract;
      const stakeTx = await contractWithSigner.stakeTokens(amountWei);
      await stakeTx.wait();

      return true;
    } catch (error) {
      console.error("Error staking tokens:", error);
      throw error;
    }
  }

  // Unstake tokens
  async unstakeTokens(amount: string): Promise<boolean> {
    if (!this.contract || !this.provider) {
      throw new Error("Contract not initialized");
    }

    try {
      const signer = await this.provider.getSigner();
      const amountWei = parseEther(amount);

      const contractWithSigner = this.contract.connect(signer) as Contract;
      const unstakeTx = await contractWithSigner.unstakeTokens(amountWei);
      await unstakeTx.wait();

      return true;
    } catch (error) {
      console.error("Error unstaking tokens:", error);
      throw error;
    }
  }

  // Get vote receipt for a voter on a proposal
  async getReceipt(proposalId: number, voter: string): Promise<VoteReceipt> {
    if (!this.contract) throw new Error("Contract not initialized");
    
    try {
      const receipt = await this.contract.getReceipt(proposalId, voter);
      return {
        hasVoted: Boolean(receipt.hasVoted || receipt[0]),
        support: Boolean(receipt.support || receipt[1]),
        votes: formatEther(receipt.votes || receipt[2])
      };
    } catch (error) {
      console.error("Error getting vote receipt:", error);
      return { hasVoted: false, support: false, votes: "0" };
    }
  }
}

export const stCoreGovernanceService = new StCoreGovernanceService();
