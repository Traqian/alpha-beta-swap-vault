
// Types for the DeFi Swap app
export interface TokenInfo {
  name: string;
  symbol: string;
  balance?: string;
  icon?: string;
}

export interface PoolInfo {
  alphaReserve: string;
  betaReserve: string;
  totalSupply: string;
  exchangeRate: string;
  fee: number;
}

export interface WalletInfo {
  address: string;
  isConnected: boolean;
  alphaBalance: string;
  betaBalance: string;
  lpBalance: string;
}

export enum SwapType {
  ALPHA_TO_BETA = 'ALPHA_TO_BETA',
  BETA_TO_ALPHA = 'BETA_TO_ALPHA',
}

export interface SwapInfo {
  type: SwapType;
  inputAmount: string;
  outputAmount: string;
  priceImpact: string;
  minimumReceived: string;
  fee: string;
}
