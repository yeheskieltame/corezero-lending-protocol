
import { ethers } from 'ethers';
import { BTCInsurancePoolABI } from '../lib/abis/BTCInsurancePoolABI';
import { TokenABI } from '../lib/abis/TokenABI';
import { CONTRACT_ADDRESSES } from '../lib/constants';

// Define stake types as per the contract
export enum StakeType {
  NONE = 0,
  BTC = 1,
  STCORE = 2,
  DUAL = 3
}

export interface StakerInfo {
  btcAmount: string;
  stCoreAmount: string;
  stakingStartTime: number;
  rewardsClaimed: string;
  stakeType: StakeType;
  formattedBtcAmount: string;
  formattedStCoreAmount: string;
  formattedRewardsClaimed: string;
}

export interface PoolStats {
  btcAmount: string;
  stCoreAmount: string;
  formattedBtcAmount: string;
  formattedStCoreAmount: string;
  totalValueLocked: string;
  coverageRatio: string;
  utilizationRate: string;
}

export interface APYRates {
  btcApy: string;
  stCoreApy: string;
  dualApy: string;
}

class BTCInsurancePoolService {
  private provider: ethers.providers.Web3Provider | null = null;
  private contract: ethers.Contract | null = null;
  private btcTokenContract: ethers.Contract | null = null;
  private stCoreTokenContract: ethers.Contract | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.contract = new ethers.Contract(
        CONTRACT_ADDRESSES.BTC_INSURANCE_POOL,
        BTCInsurancePoolABI,
        this.provider
      );
      this.btcTokenContract = new ethers.Contract(
        CONTRACT_ADDRESSES.BTC_TOKEN,
        TokenABI,
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

  // Get staker information
  async getStakerInfo(address: string): Promise<StakerInfo> {
    if (!this.contract) throw new Error("Contract not initialized");
    
    try {
      const stakerInfo = await this.contract.getStakerInfo(address);
      const btcDecimals = await this.btcTokenContract?.decimals() || 8;
      const stCoreDecimals = await this.stCoreTokenContract?.decimals() || 18;
      
      return {
        btcAmount: stakerInfo.btcAmount.toString(),
        stCoreAmount: stakerInfo.stCoreAmount.toString(),
        stakingStartTime: stakerInfo.stakingStartTime.toNumber(),
        rewardsClaimed: stakerInfo.rewardsClaimed.toString(),
        stakeType: stakerInfo.stakeType,
        formattedBtcAmount: ethers.utils.formatUnits(stakerInfo.btcAmount, btcDecimals),
        formattedStCoreAmount: ethers.utils.formatUnits(stakerInfo.stCoreAmount, stCoreDecimals),
        formattedRewardsClaimed: ethers.utils.formatEther(stakerInfo.rewardsClaimed)
      };
    } catch (error) {
      console.error("Error getting staker info:", error);
      throw error;
    }
  }

  // Get pool statistics
  async getPoolStats(): Promise<PoolStats> {
    if (!this.contract) throw new Error("Contract not initialized");
    
    try {
      const [btcAmount, stCoreAmount] = await this.contract.getTotalStaked();
      const btcDecimals = await this.btcTokenContract?.decimals() || 8;
      const stCoreDecimals = await this.stCoreTokenContract?.decimals() || 18;
      
      // Calculate TVL (simplified - in production would use price feeds)
      const btcPrice = 65000; // Mock BTC price in USD
      const stCorePrice = 0.85; // Mock stCORE price in USD
      
      const formattedBtcAmount = ethers.utils.formatUnits(btcAmount, btcDecimals);
      const formattedStCoreAmount = ethers.utils.formatUnits(stCoreAmount, stCoreDecimals);
      
      const btcValue = parseFloat(formattedBtcAmount) * btcPrice;
      const stCoreValue = parseFloat(formattedStCoreAmount) * stCorePrice;
      const totalValueLocked = (btcValue + stCoreValue).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      });
      
      // Mock coverage and utilization rates
      const coverageRatio = "3.2x";
      const utilizationRate = "72.5%";
      
      return {
        btcAmount: btcAmount.toString(),
        stCoreAmount: stCoreAmount.toString(),
        formattedBtcAmount,
        formattedStCoreAmount,
        totalValueLocked,
        coverageRatio,
        utilizationRate
      };
    } catch (error) {
      console.error("Error getting pool stats:", error);
      throw error;
    }
  }

  // Get APY rates
  async getAPYRates(): Promise<APYRates> {
    if (!this.contract) throw new Error("Contract not initialized");
    
    try {
      const btcApy = await this.contract.getCurrentAPY(StakeType.BTC);
      const stCoreApy = await this.contract.getCurrentAPY(StakeType.STCORE);
      const dualApy = await this.contract.getCurrentAPY(StakeType.DUAL);
      
      // Convert basis points to percentage
      const formatAPY = (basisPoints: ethers.BigNumber) => {
        return (basisPoints.toNumber() / 100).toFixed(2) + '%';
      };
      
      return {
        btcApy: formatAPY(btcApy),
        stCoreApy: formatAPY(stCoreApy),
        dualApy: formatAPY(dualApy)
      };
    } catch (error) {
      console.error("Error getting APY rates:", error);
      // Fallback to hardcoded values if contract call fails
      return {
        btcApy: '12.4%',
        stCoreApy: '8.9%',
        dualApy: '15.9%'
      };
    }
  }

  // Stake BTC
  async stakeBTC(amount: string): Promise<boolean> {
    if (!this.contract || !this.btcTokenContract) throw new Error("Contracts not initialized");
    
    try {
      const signer = await this.getSigner();
      const signerAddress = await signer.getAddress();
      const btcDecimals = await this.btcTokenContract.decimals();
      
      const amountWei = ethers.utils.parseUnits(amount, btcDecimals);
      
      // Approve tokens first
      const tx1 = await this.btcTokenContract.connect(signer).approve(
        CONTRACT_ADDRESSES.BTC_INSURANCE_POOL,
        amountWei
      );
      await tx1.wait();
      
      // Then stake
      const tx2 = await this.contract.connect(signer).stakeBTC(amountWei);
      await tx2.wait();
      
      return true;
    } catch (error) {
      console.error("Error staking BTC:", error);
      throw error;
    }
  }

  // Stake stCORE
  async stakeStCORE(amount: string): Promise<boolean> {
    if (!this.contract || !this.stCoreTokenContract) throw new Error("Contracts not initialized");
    
    try {
      const signer = await this.getSigner();
      const signerAddress = await signer.getAddress();
      const stCoreDecimals = await this.stCoreTokenContract.decimals();
      
      const amountWei = ethers.utils.parseUnits(amount, stCoreDecimals);
      
      // Approve tokens first
      const tx1 = await this.stCoreTokenContract.connect(signer).approve(
        CONTRACT_ADDRESSES.BTC_INSURANCE_POOL,
        amountWei
      );
      await tx1.wait();
      
      // Then stake
      const tx2 = await this.contract.connect(signer).stakeSTCore(amountWei);
      await tx2.wait();
      
      return true;
    } catch (error) {
      console.error("Error staking stCORE:", error);
      throw error;
    }
  }

  // Stake dual (BTC + stCORE)
  async stakeDual(btcAmount: string, stCoreAmount: string): Promise<boolean> {
    if (!this.contract || !this.btcTokenContract || !this.stCoreTokenContract) 
      throw new Error("Contracts not initialized");
    
    try {
      const signer = await this.getSigner();
      const btcDecimals = await this.btcTokenContract.decimals();
      const stCoreDecimals = await this.stCoreTokenContract.decimals();
      
      const btcAmountWei = ethers.utils.parseUnits(btcAmount, btcDecimals);
      const stCoreAmountWei = ethers.utils.parseUnits(stCoreAmount, stCoreDecimals);
      
      // Approve tokens first
      const tx1 = await this.btcTokenContract.connect(signer).approve(
        CONTRACT_ADDRESSES.BTC_INSURANCE_POOL,
        btcAmountWei
      );
      await tx1.wait();
      
      const tx2 = await this.stCoreTokenContract.connect(signer).approve(
        CONTRACT_ADDRESSES.BTC_INSURANCE_POOL,
        stCoreAmountWei
      );
      await tx2.wait();
      
      // Then stake
      const tx3 = await this.contract.connect(signer).stakeDual(btcAmountWei, stCoreAmountWei);
      await tx3.wait();
      
      return true;
    } catch (error) {
      console.error("Error dual staking:", error);
      throw error;
    }
  }

  // Unstake
  async unstake(btcAmount: string, stCoreAmount: string): Promise<boolean> {
    if (!this.contract) throw new Error("Contract not initialized");
    
    try {
      const signer = await this.getSigner();
      
      const btcDecimals = await this.btcTokenContract?.decimals() || 8;
      const stCoreDecimals = await this.stCoreTokenContract?.decimals() || 18;
      
      const btcAmountWei = ethers.utils.parseUnits(btcAmount, btcDecimals);
      const stCoreAmountWei = ethers.utils.parseUnits(stCoreAmount, stCoreDecimals);
      
      const tx = await this.contract.connect(signer).unstake(btcAmountWei, stCoreAmountWei);
      await tx.wait();
      
      return true;
    } catch (error) {
      console.error("Error unstaking:", error);
      throw error;
    }
  }

  // Claim rewards
  async claimRewards(): Promise<string> {
    if (!this.contract) throw new Error("Contract not initialized");
    
    try {
      const signer = await this.getSigner();
      
      const tx = await this.contract.connect(signer).claimRewards();
      const receipt = await tx.wait();
      
      // Find the event with claimed amount
      const event = receipt.events?.find(e => e.event === 'RewardsClaimed');
      const claimedAmount = event ? ethers.utils.formatEther(event.args.amount) : '0';
      
      return claimedAmount;
    } catch (error) {
      console.error("Error claiming rewards:", error);
      throw error;
    }
  }
}

export const btcInsurancePoolService = new BTCInsurancePoolService();
