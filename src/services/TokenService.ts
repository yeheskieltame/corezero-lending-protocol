
import { ethers } from 'ethers';
import { TokenABI } from '../lib/abis/TokenABI';
import { CONTRACT_ADDRESSES } from '../lib/constants';

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
  formattedBalance: string;
}

class TokenService {
  private provider: ethers.providers.Web3Provider | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
    }
  }

  private async getSigner() {
    if (!this.provider) throw new Error("Provider not initialized");
    return this.provider.getSigner();
  }

  // Get token contract instance
  private getTokenContract(address: string) {
    if (!this.provider) throw new Error("Provider not initialized");
    return new ethers.Contract(address, TokenABI, this.provider);
  }

  // Get token information and balance
  async getTokenInfo(tokenAddress: string, userAddress: string): Promise<TokenInfo> {
    const tokenContract = this.getTokenContract(tokenAddress);
    
    try {
      const [name, symbol, decimals, balance] = await Promise.all([
        tokenContract.name(),
        tokenContract.symbol(),
        tokenContract.decimals(),
        tokenContract.balanceOf(userAddress)
      ]);
      
      return {
        name,
        symbol,
        decimals,
        balance: balance.toString(),
        formattedBalance: ethers.utils.formatUnits(balance, decimals)
      };
    } catch (error) {
      console.error("Error getting token info:", error);
      throw error;
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

  // Approve token spending
  async approveToken(tokenAddress: string, spenderAddress: string, amount: string): Promise<boolean> {
    if (!this.provider) throw new Error("Provider not initialized");
    
    try {
      const signer = await this.getSigner();
      const tokenContract = this.getTokenContract(tokenAddress);
      const decimals = await tokenContract.decimals();
      
      const amountWithDecimals = ethers.utils.parseUnits(amount, decimals);
      
      const tx = await tokenContract.connect(signer).approve(spenderAddress, amountWithDecimals);
      await tx.wait();
      
      return true;
    } catch (error) {
      console.error("Error approving tokens:", error);
      throw error;
    }
  }
}

export const tokenService = new TokenService();
