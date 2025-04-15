
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { TokenInfo, PoolInfo, WalletInfo, SwapType, SwapInfo } from "../types/defi";
import { 
  ALPHA_TOKEN, 
  BETA_TOKEN, 
  FEE_PERCENT, 
  calculateOutputAmount, 
  calculatePriceImpact,
  calculateFeeAmount,
  calculateMinimumReceived,
  calculateExchangeRate,
  mockConnectWallet,
  mockGetPoolData,
  mockGetWalletBalances,
  parseInput,
  formatNumber,
  calculateLPTokensToMint,
  calculateRemoveLiquidityAmounts
} from "../utils/defiUtils";

interface DefiContextType {
  // Wallet
  wallet: WalletInfo;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  
  // Pool data
  pool: PoolInfo;
  refreshPool: () => Promise<void>;
  
  // Tokens
  alphaToken: TokenInfo;
  betaToken: TokenInfo;
  
  // Swap
  swapType: SwapType;
  setSwapType: (type: SwapType) => void;
  inputAmount: string;
  setInputAmount: (amount: string) => void;
  outputAmount: string;
  swapTokens: () => void;
  executeSwap: () => Promise<void>;
  
  // Liquidity
  alphaAmount: string;
  setAlphaAmount: (amount: string) => void;
  betaAmount: string;
  setBetaAmount: (amount: string) => void;
  addLiquidity: () => Promise<void>;
  
  // Remove Liquidity
  lpAmount: string;
  setLpAmount: (amount: string) => void;
  removeLiquidity: () => Promise<void>;
  
  // UI State
  isLoading: boolean;
  slippageTolerance: number;
  setSlippageTolerance: (slippage: number) => void;
}

const DefiContext = createContext<DefiContextType | undefined>(undefined);

export const DefiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Wallet state
  const [wallet, setWallet] = useState<WalletInfo>({
    address: "",
    isConnected: false,
    alphaBalance: "0",
    betaBalance: "0",
    lpBalance: "0"
  });
  
  // Pool data
  const [pool, setPool] = useState<PoolInfo>({
    alphaReserve: "0",
    betaReserve: "0",
    totalSupply: "0",
    exchangeRate: "0",
    fee: FEE_PERCENT * 100
  });
  
  // Tokens
  const [alphaToken, setAlphaToken] = useState<TokenInfo>(ALPHA_TOKEN);
  const [betaToken, setBetaToken] = useState<TokenInfo>(BETA_TOKEN);
  
  // Swap state
  const [swapType, setSwapType] = useState<SwapType>(SwapType.ALPHA_TO_BETA);
  const [inputAmount, setInputAmount] = useState<string>("");
  const [outputAmount, setOutputAmount] = useState<string>("");
  
  // Liquidity state
  const [alphaAmount, setAlphaAmount] = useState<string>("");
  const [betaAmount, setBetaAmount] = useState<string>("");
  const [lpAmount, setLpAmount] = useState<string>("");
  
  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [slippageTolerance, setSlippageTolerance] = useState<number>(0.5);
  
  // Initialize and fetch pool data even if wallet not connected
  useEffect(() => {
    refreshPool();
  }, []);
  
  // Calculate output amount when input amount or swap type changes
  useEffect(() => {
    if (inputAmount !== '') {
      calculateOutput();
    } else {
      setOutputAmount('');
    }
  }, [inputAmount, swapType, pool]);
  
  // Calculate beta amount based on alpha amount when adding liquidity
  useEffect(() => {
    if (alphaAmount !== '' && parseInput(pool.alphaReserve) > 0 && parseInput(pool.betaReserve) > 0) {
      const alphaValue = parseInput(alphaAmount);
      const betaValue = alphaValue * parseInput(pool.betaReserve) / parseInput(pool.alphaReserve);
      setBetaAmount(formatNumber(betaValue));
    }
  }, [alphaAmount, pool]);
  
  // Connect wallet
  const connectWallet = async () => {
    try {
      setIsLoading(true);
      
      // Mock wallet connection
      const { address } = await mockConnectWallet();
      const { alpha, beta, lp } = await mockGetWalletBalances();
      
      setWallet({
        address,
        isConnected: true,
        alphaBalance: alpha,
        betaBalance: beta,
        lpBalance: lp
      });
      
      toast.success("Wallet connected successfully!");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Disconnect wallet
  const disconnectWallet = () => {
    setWallet({
      address: "",
      isConnected: false,
      alphaBalance: "0",
      betaBalance: "0",
      lpBalance: "0"
    });
    toast.info("Wallet disconnected");
  };
  
  // Refresh pool data
  const refreshPool = async () => {
    try {
      const poolData = await mockGetPoolData();
      setPool(poolData);
      
      // If wallet is connected, refresh balances
      if (wallet.isConnected) {
        const { alpha, beta, lp } = await mockGetWalletBalances();
        setWallet(prev => ({
          ...prev,
          alphaBalance: alpha,
          betaBalance: beta,
          lpBalance: lp
        }));
      }
    } catch (error) {
      console.error("Error fetching pool data:", error);
      toast.error("Failed to fetch pool data");
    }
  };
  
  // Calculate output amount based on input and swap type
  const calculateOutput = () => {
    const input = parseInput(inputAmount);
    if (input <= 0) {
      setOutputAmount("");
      return;
    }
    
    let inputReserve, outputReserve;
    
    if (swapType === SwapType.ALPHA_TO_BETA) {
      inputReserve = parseFloat(pool.alphaReserve);
      outputReserve = parseFloat(pool.betaReserve);
    } else {
      inputReserve = parseFloat(pool.betaReserve);
      outputReserve = parseFloat(pool.alphaReserve);
    }
    
    const output = calculateOutputAmount(input, inputReserve, outputReserve);
    setOutputAmount(formatNumber(output));
  };
  
  // Swap token order
  const swapTokens = () => {
    setSwapType(swapType === SwapType.ALPHA_TO_BETA ? SwapType.BETA_TO_ALPHA : SwapType.ALPHA_TO_BETA);
    setInputAmount(outputAmount);
    setOutputAmount("");
  };
  
  // Execute swap
  const executeSwap = async () => {
    try {
      if (!wallet.isConnected) {
        toast.error("Please connect your wallet first");
        return;
      }
      
      setIsLoading(true);
      
      // Here we would normally call contract methods
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update balances and pool data
      const inputValue = parseInput(inputAmount);
      const outputValue = parseInput(outputAmount);
      
      if (swapType === SwapType.ALPHA_TO_BETA) {
        setWallet(prev => ({
          ...prev,
          alphaBalance: formatNumber(parseInput(prev.alphaBalance) - inputValue),
          betaBalance: formatNumber(parseInput(prev.betaBalance) + outputValue)
        }));
        
        setPool(prev => ({
          ...prev,
          alphaReserve: formatNumber(parseInput(prev.alphaReserve) + inputValue),
          betaReserve: formatNumber(parseInput(prev.betaReserve) - outputValue),
          exchangeRate: calculateExchangeRate(
            parseInput(prev.alphaReserve) + inputValue, 
            parseInput(prev.betaReserve) - outputValue
          )
        }));
      } else {
        setWallet(prev => ({
          ...prev,
          betaBalance: formatNumber(parseInput(prev.betaBalance) - inputValue),
          alphaBalance: formatNumber(parseInput(prev.alphaBalance) + outputValue)
        }));
        
        setPool(prev => ({
          ...prev,
          betaReserve: formatNumber(parseInput(prev.betaReserve) + inputValue),
          alphaReserve: formatNumber(parseInput(prev.alphaReserve) - outputValue),
          exchangeRate: calculateExchangeRate(
            parseInput(prev.alphaReserve) - outputValue, 
            parseInput(prev.betaReserve) + inputValue
          )
        }));
      }
      
      toast.success("Swap executed successfully!");
      setInputAmount("");
      setOutputAmount("");
    } catch (error) {
      console.error("Swap error:", error);
      toast.error("Failed to execute swap");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add liquidity
  const addLiquidity = async () => {
    try {
      if (!wallet.isConnected) {
        toast.error("Please connect your wallet first");
        return;
      }
      
      setIsLoading(true);
      
      const alphaValue = parseInput(alphaAmount);
      const betaValue = parseInput(betaAmount);
      
      if (alphaValue <= 0 || betaValue <= 0) {
        toast.error("Invalid input amounts");
        return;
      }
      
      // Calculate LP tokens to mint
      const lpTokensToMint = calculateLPTokensToMint(
        alphaValue,
        betaValue,
        parseInput(pool.alphaReserve),
        parseInput(pool.betaReserve),
        parseInput(pool.totalSupply)
      );
      
      // Update balances
      setWallet(prev => ({
        ...prev,
        alphaBalance: formatNumber(parseInput(prev.alphaBalance) - alphaValue),
        betaBalance: formatNumber(parseInput(prev.betaBalance) - betaValue),
        lpBalance: formatNumber(parseInput(prev.lpBalance) + lpTokensToMint)
      }));
      
      // Update pool
      setPool(prev => ({
        ...prev,
        alphaReserve: formatNumber(parseInput(prev.alphaReserve) + alphaValue),
        betaReserve: formatNumber(parseInput(prev.betaReserve) + betaValue),
        totalSupply: formatNumber(parseInput(prev.totalSupply) + lpTokensToMint)
      }));
      
      toast.success("Liquidity added successfully!");
      setAlphaAmount("");
      setBetaAmount("");
    } catch (error) {
      console.error("Add liquidity error:", error);
      toast.error("Failed to add liquidity");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Remove liquidity
  const removeLiquidity = async () => {
    try {
      if (!wallet.isConnected) {
        toast.error("Please connect your wallet first");
        return;
      }
      
      setIsLoading(true);
      
      const lpValue = parseInput(lpAmount);
      
      if (lpValue <= 0 || lpValue > parseInput(wallet.lpBalance)) {
        toast.error("Invalid LP amount");
        return;
      }
      
      // Calculate tokens to return
      const { amountA, amountB } = calculateRemoveLiquidityAmounts(
        lpValue,
        parseInput(pool.alphaReserve),
        parseInput(pool.betaReserve),
        parseInput(pool.totalSupply)
      );
      
      // Update balances
      setWallet(prev => ({
        ...prev,
        alphaBalance: formatNumber(parseInput(prev.alphaBalance) + amountA),
        betaBalance: formatNumber(parseInput(prev.betaBalance) + amountB),
        lpBalance: formatNumber(parseInput(prev.lpBalance) - lpValue)
      }));
      
      // Update pool
      setPool(prev => ({
        ...prev,
        alphaReserve: formatNumber(parseInput(prev.alphaReserve) - amountA),
        betaReserve: formatNumber(parseInput(prev.betaReserve) - amountB),
        totalSupply: formatNumber(parseInput(prev.totalSupply) - lpValue)
      }));
      
      toast.success("Liquidity removed successfully!");
      setLpAmount("");
    } catch (error) {
      console.error("Remove liquidity error:", error);
      toast.error("Failed to remove liquidity");
    } finally {
      setIsLoading(false);
    }
  };
  
  const contextValue: DefiContextType = {
    wallet,
    connectWallet,
    disconnectWallet,
    pool,
    refreshPool,
    alphaToken,
    betaToken,
    swapType,
    setSwapType,
    inputAmount,
    setInputAmount,
    outputAmount,
    swapTokens,
    executeSwap,
    alphaAmount,
    setAlphaAmount,
    betaAmount,
    setBetaAmount,
    addLiquidity,
    lpAmount,
    setLpAmount,
    removeLiquidity,
    isLoading,
    slippageTolerance,
    setSlippageTolerance
  };
  
  return (
    <DefiContext.Provider value={contextValue}>
      {children}
    </DefiContext.Provider>
  );
};

export const useDefi = (): DefiContextType => {
  const context = useContext(DefiContext);
  if (context === undefined) {
    throw new Error("useDefi must be used within a DefiProvider");
  }
  return context;
};
