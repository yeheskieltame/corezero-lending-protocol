
import { ethers, parseEther, formatEther, Contract } from 'ethers';
import { TokenABI } from '../lib/abis/TokenABI';
import { CONTRACT_ADDRESSES } from '../lib/constants';

interface TokenInfo {
  balance: string;
  formattedBalance: string;
  symbol: string;
  decimals: number;
}

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

  // Get token info with additional metadata
  async getTokenInfo(tokenAddress: string, userAddress: string): Promise<TokenInfo> {
    try {
      const contract = this.getTokenContract(tokenAddress);
      const [balance, symbol, decimals] = await Promise.all([
        contract.balanceOf(userAddress),
        contract.symbol(),
        contract.decimals()
      ]);
      
      return {
        balance: balance.toString(),
        formattedBalance: formatEther(balance),
        symbol,
        decimals
      };
    } catch (error) {
      console.error("Error getting token info:", error);
      return {
        balance: "0",
        formattedBalance: "0",
        symbol: "UNKNOWN",
        decimals: 18
      };
    }
  }

  // Get BTC token info
  async getBTCTokenInfo(userAddress: string): Promise<TokenInfo> {
    return this.getTokenInfo(CONTRACT_ADDRESSES.BTC_TOKEN, userAddress);
  }

  // Get stCORE token info
  async getStCORETokenInfo(userAddress: string): Promise<TokenInfo> {
    return this.getTokenInfo(CONTRACT_ADDRESSES.STCORE_TOKEN, userAddress);
  }

  // Get CORE token info
  async getCORETokenInfo(userAddress: string): Promise<TokenInfo> {
    return this.getTokenInfo(CONTRACT_ADDRESSES.CORE_TOKEN, userAddress);
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
