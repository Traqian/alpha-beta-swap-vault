
import { PoolInfo, SwapType } from "../types/defi";

// Constants
export const FEE_PERCENT = 0.003; // 0.3% swap fee

// Token information
export const ALPHA_TOKEN = {
  name: "Alpha",
  symbol: "ALPHA",
  icon: "🔵"
};

export const BETA_TOKEN = {
  name: "Beta",
  symbol: "BETA",
  icon: "🟣"
};

// AMM Calculations using Constant Product Formula: x * y = k
// Where x and y are the reserves of the tokens in the pool

// Calculate output amount based on input amount
export const calculateOutputAmount = (
  inputAmount: number,
  inputReserve: number,
  outputReserve: number
): number => {
  if (inputAmount <= 0 || inputReserve <= 0 || outputReserve <= 0) return 0;
  
  // Apply the fee
  const inputAmountWithFee = inputAmount * (1 - FEE_PERCENT);
  
  // Constant product formula: (x + dx) * (y - dy) = x * y
  // dy = y * dx / (x + dx)
  return (outputReserve * inputAmountWithFee) / (inputReserve + inputAmountWithFee);
};

// Calculate price impact
export const calculatePriceImpact = (
  inputAmount: number,
  inputReserve: number,
  outputReserve: number
): number => {
  if (inputAmount <= 0 || inputReserve <= 0 || outputReserve <= 0) return 0;
  
  const spotPrice = outputReserve / inputReserve;
  const outputAmount = calculateOutputAmount(inputAmount, inputReserve, outputReserve);
  const executionPrice = outputAmount / inputAmount;
  
  return Math.abs((spotPrice - executionPrice) / spotPrice) * 100;
};

// Calculate fee amount
export const calculateFeeAmount = (inputAmount: number): number => {
  return inputAmount * FEE_PERCENT;
};

// Calculate minimum received after slippage
export const calculateMinimumReceived = (
  outputAmount: number,
  slippageTolerance: number
): number => {
  return outputAmount * (1 - slippageTolerance / 100);
};

// Format number to fixed decimals with commas
export const formatNumber = (num: number | string, decimals: number = 4): string => {
  if (typeof num === 'string') {
    num = parseFloat(num);
  }
  
  if (isNaN(num) || num === null || num === undefined) return '0';
  
  const fixedNum = num.toFixed(decimals);
  // Remove trailing zeros
  const parts = fixedNum.split('.');
  if (parts.length === 2) {
    const decimalPart = parts[1].replace(/0+$/, '');
    return parts[0] + (decimalPart ? '.' + decimalPart : '');
  }
  return parts[0];
};

// Parse user input to handle decimals and non-numeric characters
export const parseInput = (input: string): number => {
  const parsedInput = parseFloat(input);
  return isNaN(parsedInput) ? 0 : parsedInput;
};

// Calculate exchange rate
export const calculateExchangeRate = (alphaReserve: number, betaReserve: number): string => {
  if (alphaReserve <= 0 || betaReserve <= 0) return '0';
  return formatNumber(betaReserve / alphaReserve);
};

// Calculate LP token amount for adding liquidity
export const calculateLPTokensToMint = (
  inputAmountA: number,
  inputAmountB: number,
  reserveA: number,
  reserveB: number,
  totalSupply: number
): number => {
  // If first liquidity provision
  if (totalSupply === 0 || reserveA === 0 || reserveB === 0) {
    return Math.sqrt(inputAmountA * inputAmountB);
  }

  // Calculate based on proportion of existing reserves
  const shareA = inputAmountA / reserveA;
  const shareB = inputAmountB / reserveB;
  const share = Math.min(shareA, shareB); // Use the smaller proportion
  
  return share * totalSupply;
};

// Calculate token amounts to return when removing liquidity
export const calculateRemoveLiquidityAmounts = (
  lpAmount: number,
  reserveA: number,
  reserveB: number,
  totalSupply: number
): { amountA: number; amountB: number } => {
  if (totalSupply <= 0) return { amountA: 0, amountB: 0 };
  
  const share = lpAmount / totalSupply;
  return {
    amountA: share * reserveA,
    amountB: share * reserveB
  };
};

// Mock wallet connection
export const mockConnectWallet = async (): Promise<{ address: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ address: '0x' + Math.random().toString(16).slice(2, 12) });
    }, 500);
  });
};

// Mock blockchain data retrieval
export const mockGetPoolData = async (): Promise<PoolInfo> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        alphaReserve: '1000',
        betaReserve: '1000',
        totalSupply: '1000',
        exchangeRate: '1',
        fee: FEE_PERCENT * 100
      });
    }, 300);
  });
};

// Mock wallet balances
export const mockGetWalletBalances = async (): Promise<{ alpha: string; beta: string; lp: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        alpha: (100 + Math.random() * 100).toFixed(2),
        beta: (100 + Math.random() * 100).toFixed(2),
        lp: (5 + Math.random() * 10).toFixed(2)
      });
    }, 300);
  });
};
