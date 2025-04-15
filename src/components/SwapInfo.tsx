
import React from "react";
import { useDefi } from "../context/DefiContext";
import { SwapType } from "../types/defi";
import { 
  calculatePriceImpact, 
  calculateFeeAmount, 
  calculateMinimumReceived, 
  parseInput, 
  formatNumber 
} from "../utils/defiUtils";

const SwapInfo: React.FC = () => {
  const { 
    pool, 
    swapType, 
    inputAmount, 
    outputAmount,
    slippageTolerance
  } = useDefi();
  
  // Skip rendering if no input/output
  if (!inputAmount || !outputAmount) return null;
  
  const input = parseInput(inputAmount);
  const output = parseInput(outputAmount);
  
  // Get reserves based on swap type
  const inputReserve = swapType === SwapType.ALPHA_TO_BETA 
    ? parseInput(pool.alphaReserve) 
    : parseInput(pool.betaReserve);
  
  const outputReserve = swapType === SwapType.ALPHA_TO_BETA 
    ? parseInput(pool.betaReserve) 
    : parseInput(pool.alphaReserve);
  
  // Calculate swap details
  const priceImpact = calculatePriceImpact(input, inputReserve, outputReserve);
  const feeAmount = calculateFeeAmount(input);
  const minimumReceived = calculateMinimumReceived(output, slippageTolerance);
  
  const fromSymbol = swapType === SwapType.ALPHA_TO_BETA ? 'ALPHA' : 'BETA';
  const toSymbol = swapType === SwapType.ALPHA_TO_BETA ? 'BETA' : 'ALPHA';
  
  return (
    <div className="mt-4 p-4 rounded-lg bg-muted/30 text-sm">
      <div className="flex justify-between mb-2">
        <span className="text-muted-foreground">Price Impact</span>
        <span className={`font-medium ${priceImpact > 5 ? 'text-destructive' : 'text-foreground'}`}>
          {formatNumber(priceImpact, 2)}%
        </span>
      </div>
      
      <div className="flex justify-between mb-2">
        <span className="text-muted-foreground">LP Fee ({pool.fee}%)</span>
        <span className="font-medium">
          {formatNumber(feeAmount)} {fromSymbol}
        </span>
      </div>
      
      <div className="flex justify-between">
        <span className="text-muted-foreground">Minimum Received</span>
        <span className="font-medium">
          {formatNumber(minimumReceived)} {toSymbol}
        </span>
      </div>
      
      <div className="flex justify-between mt-3 pt-2 border-t border-border">
        <span className="text-muted-foreground">Exchange Rate</span>
        <span className="font-medium">
          1 {fromSymbol} = {swapType === SwapType.ALPHA_TO_BETA 
            ? formatNumber(parseInput(pool.betaReserve) / parseInput(pool.alphaReserve)) 
            : formatNumber(parseInput(pool.alphaReserve) / parseInput(pool.betaReserve))
          } {toSymbol}
        </span>
      </div>
    </div>
  );
};

export default SwapInfo;
