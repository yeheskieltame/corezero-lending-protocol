
import { ethers, parseEther, formatEther, Contract } from 'ethers';
import { TokenABI } from '../lib/abis/TokenABI';
import { CONTRACT_ADDRESSES } from '../lib/constants';

class TokenService {
  private provider: ethers.BrowserProvider | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
    }
  }

  // Get token contract instance
  private getTokenContract(tokenAddress: string): Contract {
    if (!this.provider) throw new Error("Provider not initialized");
    return new ethers.Contract(tokenAddress, TokenABI, this.provider);
  }

  // Get token balance
  async getTokenBalance(tokenAddress: string, userAddress: string): Promise<string> {
    try {
      const contract = this.getTokenContract(tokenAddress);
      const balance = await contract.balanceOf(userAddress);
      return formatEther(balance);
    } catch (error) {
      console.error("Error getting token balance:", error);
      return "0";
    }
  }

  // Get BTC token balance
  async getBTCBalance(userAddress: string): Promise<string> {
    return this.getTokenBalance(CONTRACT_ADDRESSES.BTC_TOKEN, userAddress);
  }

  // Get stCORE token balance
  async getStCoreBalance(userAddress: string): Promise<string> {
    return this.getTokenBalance(CONTRACT_ADDRESSES.STCORE_TOKEN, userAddress);
  }

  // Get CORE token balance
  async getCoreBalance(userAddress: string): Promise<string> {
    return this.getTokenBalance(CONTRACT_ADDRESSES.CORE_TOKEN, userAddress);
  }

  // Approve token spending
  async approveToken(tokenAddress: string, spenderAddress: string, amount: string): Promise<boolean> {
    if (!this.provider) throw new Error("Provider not initialized");

    try {
      const signer = await this.provider.getSigner();
      const contract = this.getTokenContract(tokenAddress);
      const amountWei = parseEther(amount);

      const contractWithSigner = contract.connect(signer) as Contract;
      const approveTx = await contractWithSigner.approve(spenderAddress, amountWei);
      await approveTx.wait();

      return true;
    } catch (error) {
      console.error("Error approving token:", error);
      throw error;
    }
  }

  // Get token allowance
  async getTokenAllowance(tokenAddress: string, ownerAddress: string, spenderAddress: string): Promise<string> {
    try {
      const contract = this.getTokenContract(tokenAddress);
      const allowance = await contract.allowance(ownerAddress, spenderAddress);
      return formatEther(allowance);
    } catch (error) {
      console.error("Error getting token allowance:", error);
      return "0";
    }
  }
}

export const tokenService = new TokenService();
