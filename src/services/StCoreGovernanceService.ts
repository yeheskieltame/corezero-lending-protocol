
import { ethers } from 'ethers';
import { StCoreGovernanceABI } from '../lib/abis/StCoreGovernanceABI';
import { TokenABI } from '../lib/abis/TokenABI';
import { CONTRACT_ADDRESSES } from '../lib/constants';

export enum ProposalState {
  PENDING = 0,
  ACTIVE = 1,
  CANCELED = 2,
  DEFEATED = 3,
  SUCCEEDED = 4,
  EXECUTED = 5,
  EXPIRED = 6
}

export interface ProposalDetails {
  id: string;
  proposer: string;
  description: string;
  startBlock: number;
  endBlock: number;
  forVotes: string;
  againstVotes: string;
  canceled: boolean;
  executed: boolean;
  state: ProposalState;
  formattedForVotes: string;
  formattedAgainstVotes: string;
  totalVotes: string;
  supportPercentage: number;
}

export interface VoteReceipt {
  hasVoted: boolean;
  support: boolean;
  votes: string;
  formattedVotes: string;
}

class StCoreGovernanceService {
  private provider: ethers.providers.Web3Provider | null = null;
  private contract: ethers.Contract | null = null;
  private stCoreTokenContract: ethers.Contract | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
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

  private async getSigner() {
    if (!this.provider) throw new Error("Provider not initialized");
    return this.provider.getSigner();
  }

  // Get proposal details
  async getProposalDetails(id: string): Promise<ProposalDetails> {
    if (!this.contract) throw new Error("Contract not initialized");
    
    try {
      const [details, state] = await Promise.all([
        this.contract.getProposalDetails(id),
        this.contract.getProposalState(id)
      ]);
      
      const formattedForVotes = ethers.utils.formatEther(details.forVotes);
      const formattedAgainstVotes = ethers.utils.formatEther(details.againstVotes);
      const totalVotes = ethers.utils.formatEther(details.forVotes.add(details.againstVotes));
      
      // Calculate support percentage
      let supportPercentage = 0;
      if (details.forVotes.gt(0) || details.againstVotes.gt(0)) {
        supportPercentage = Math.round(
          details.forVotes.mul(100).div(details.forVotes.add(details.againstVotes)).toNumber()
        );
      }
      
      return {
        id: details.id.toString(),
        proposer: details.proposer,
        description: details.description,
        startBlock: details.startBlock.toNumber(),
        endBlock: details.endBlock.toNumber(),
        forVotes: details.forVotes.toString(),
        againstVotes: details.againstVotes.toString(),
        canceled: details.canceled,
        executed: details.executed,
        state,
        formattedForVotes,
        formattedAgainstVotes,
        totalVotes,
        supportPercentage
      };
    } catch (error) {
      console.error("Error getting proposal details:", error);
      throw error;
    }
  }

  // Create loan proposal
  async createLoanProposal(loanId: string, description: string): Promise<string> {
    if (!this.contract) throw new Error("Contract not initialized");
    
    try {
      const signer = await this.getSigner();
      const tx = await this.contract.connect(signer).createLoanProposal(loanId, description);
      const receipt = await tx.wait();
      
      // Find the event with proposal id
      const event = receipt.events?.find(e => e.event === 'ProposalCreated');
      const proposalId = event ? event.args.id.toString() : '0';
      
      return proposalId;
    } catch (error) {
      console.error("Error creating loan proposal:", error);
      throw error;
    }
  }

  // Cast vote on proposal
  async castVote(proposalId: string, support: boolean): Promise<string> {
    if (!this.contract) throw new Error("Contract not initialized");
    
    try {
      const signer = await this.getSigner();
      const tx = await this.contract.connect(signer).castVote(proposalId, support);
      const receipt = await tx.wait();
      
      // Find the event with vote weight
      const event = receipt.events?.find(e => e.event === 'VoteCast');
      const votes = event ? ethers.utils.formatEther(event.args.votes) : '0';
      
      return votes;
    } catch (error) {
      console.error("Error casting vote:", error);
      throw error;
    }
  }

  // Execute proposal
  async executeProposal(proposalId: string): Promise<boolean> {
    if (!this.contract) throw new Error("Contract not initialized");
    
    try {
      const signer = await this.getSigner();
      const tx = await this.contract.connect(signer).executeProposal(proposalId);
      await tx.wait();
      
      return true;
    } catch (error) {
      console.error("Error executing proposal:", error);
      throw error;
    }
  }

  // Get voting power
  async getVotingPower(address: string): Promise<string> {
    if (!this.contract) throw new Error("Contract not initialized");
    
    try {
      const votingPower = await this.contract.getVotingPower(address);
      return ethers.utils.formatEther(votingPower);
    } catch (error) {
      console.error("Error getting voting power:", error);
      return '0';
    }
  }

  // Stake tokens for governance
  async stakeTokens(amount: string): Promise<boolean> {
    if (!this.contract || !this.stCoreTokenContract) 
      throw new Error("Contracts not initialized");
    
    try {
      const signer = await this.getSigner();
      const amountWei = ethers.utils.parseEther(amount);
      
      // Approve tokens first
      const tx1 = await this.stCoreTokenContract.connect(signer).approve(
        CONTRACT_ADDRESSES.STCORE_GOVERNANCE,
        amountWei
      );
      await tx1.wait();
      
      // Then stake
      const tx2 = await this.contract.connect(signer).stakeTokens(amountWei);
      await tx2.wait();
      
      return true;
    } catch (error) {
      console.error("Error staking tokens:", error);
      throw error;
    }
  }

  // Unstake tokens from governance
  async unstakeTokens(amount: string): Promise<boolean> {
    if (!this.contract) throw new Error("Contract not initialized");
    
    try {
      const signer = await this.getSigner();
      const amountWei = ethers.utils.parseEther(amount);
      
      const tx = await this.contract.connect(signer).unstakeTokens(amountWei);
      await tx.wait();
      
      return true;
    } catch (error) {
      console.error("Error unstaking tokens:", error);
      throw error;
    }
  }
}

export const stCoreGovernanceService = new StCoreGovernanceService();
