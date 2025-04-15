
import React from "react";
import { Button } from "@/components/ui/button";
import { useDefi } from "../context/DefiContext";
import { SwapType } from "../types/defi";
import TokenSelector from "./TokenSelector";
import SwapInfo from "./SwapInfo";
import { ArrowDownUp } from "lucide-react";

const Swap: React.FC = () => {
  const { 
    wallet,
    swapType,
    alphaToken, 
    betaToken,
    inputAmount,
    setInputAmount,
    outputAmount,
    swapTokens,
    executeSwap,
    isLoading
  } = useDefi();
  
  // Determine which token is input/output based on swap type
  const fromToken = swapType === SwapType.ALPHA_TO_BETA ? alphaToken : betaToken;
  const toToken = swapType === SwapType.ALPHA_TO_BETA ? betaToken : alphaToken;
  
  const fromBalance = swapType === SwapType.ALPHA_TO_BETA ? wallet.alphaBalance : wallet.betaBalance;
  const toBalance = swapType === SwapType.ALPHA_TO_BETA ? wallet.betaBalance : wallet.alphaBalance;
  
  // Button text and state
  let buttonText = "Connect Wallet";
  let isButtonDisabled = !wallet.isConnected;
  
  if (wallet.isConnected) {
    if (isLoading) {
      buttonText = "Swapping...";
      isButtonDisabled = true;
    } else if (!inputAmount || parseFloat(inputAmount) <= 0) {
      buttonText = "Enter an amount";
      isButtonDisabled = true;
    } else if (parseFloat(inputAmount) > parseFloat(fromBalance)) {
      buttonText = "Insufficient balance";
      isButtonDisabled = true;
    } else {
      buttonText = "Swap";
      isButtonDisabled = false;
    }
  }
  
  return (
    <div className="defi-card overflow-hidden">
      <div className="bg-gradient-card p-5">
        <h2 className="text-xl font-medium">Swap</h2>
        <p className="text-sm text-muted-foreground">Trade tokens in an instant</p>
      </div>
      
      <div className="p-5">
        <div className="space-y-3">
          <TokenSelector
            token={fromToken}
            amount={inputAmount}
            setAmount={setInputAmount}
            balance={wallet.isConnected ? fromBalance : undefined}
          />
          
          <div className="relative flex justify-center">
            <button
              className="absolute top-1/2 -translate-y-1/2 bg-defi-accent rounded-full p-2 shadow-lg hover:bg-defi-secondary transition-colors"
              onClick={swapTokens}
            >
              <ArrowDownUp className="h-4 w-4 text-white" />
            </button>
            <div className="border-t border-border w-full my-4"></div>
          </div>
          
          <TokenSelector
            token={toToken}
            amount={outputAmount}
            setAmount={() => {}}
            balance={wallet.isConnected ? toBalance : undefined}
            readonly={true}
          />
          
          {inputAmount && outputAmount && <SwapInfo />}
        </div>
        
        <Button
          className="defi-button w-full mt-6"
          onClick={executeSwap}
          disabled={isButtonDisabled}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default Swap;
