
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDefi } from "../context/DefiContext";
import TokenSelector from "./TokenSelector";
import { parseInput } from "../utils/defiUtils";
import { Plus, Minus } from "lucide-react";

const Liquidity: React.FC = () => {
  const {
    wallet,
    alphaToken,
    betaToken,
    alphaAmount,
    setAlphaAmount,
    betaAmount,
    setBetaAmount,
    lpAmount,
    setLpAmount,
    addLiquidity,
    removeLiquidity,
    isLoading
  } = useDefi();
  
  // Add Liquidity button state
  let addButtonText = "Connect Wallet";
  let isAddButtonDisabled = !wallet.isConnected;
  
  // Remove Liquidity button state
  let removeButtonText = "Connect Wallet";
  let isRemoveButtonDisabled = !wallet.isConnected;
  
  if (wallet.isConnected) {
    if (isLoading) {
      addButtonText = "Adding...";
      removeButtonText = "Removing...";
      isAddButtonDisabled = true;
      isRemoveButtonDisabled = true;
    } else {
      // Add liquidity validation
      if (!alphaAmount || parseInput(alphaAmount) <= 0 || !betaAmount || parseInput(betaAmount) <= 0) {
        addButtonText = "Enter amounts";
        isAddButtonDisabled = true;
      } else if (parseInput(alphaAmount) > parseInput(wallet.alphaBalance)) {
        addButtonText = "Insufficient ALPHA balance";
        isAddButtonDisabled = true;
      } else if (parseInput(betaAmount) > parseInput(wallet.betaBalance)) {
        addButtonText = "Insufficient BETA balance";
        isAddButtonDisabled = true;
      } else {
        addButtonText = "Add Liquidity";
        isAddButtonDisabled = false;
      }
      
      // Remove liquidity validation
      if (!lpAmount || parseInput(lpAmount) <= 0) {
        removeButtonText = "Enter LP amount";
        isRemoveButtonDisabled = true;
      } else if (parseInput(lpAmount) > parseInput(wallet.lpBalance)) {
        removeButtonText = "Insufficient LP balance";
        isRemoveButtonDisabled = true;
      } else {
        removeButtonText = "Remove Liquidity";
        isRemoveButtonDisabled = false;
      }
    }
  }
  
  return (
    <div className="defi-card overflow-hidden">
      <div className="bg-gradient-card p-5">
        <h2 className="text-xl font-medium">Liquidity</h2>
        <p className="text-sm text-muted-foreground">Add or remove liquidity to earn fees</p>
      </div>
      
      <Tabs defaultValue="add" className="p-5">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="add" className="flex items-center gap-1">
            <Plus className="h-4 w-4" /> Add
          </TabsTrigger>
          <TabsTrigger value="remove" className="flex items-center gap-1">
            <Minus className="h-4 w-4" /> Remove
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="add">
          <div className="space-y-4">
            <TokenSelector
              token={alphaToken}
              amount={alphaAmount}
              setAmount={setAlphaAmount}
              balance={wallet.isConnected ? wallet.alphaBalance : undefined}
            />
            
            <div className="relative flex justify-center">
              <div className="absolute top-1/2 -translate-y-1/2 bg-muted rounded-full p-2">
                <Plus className="h-3 w-3" />
              </div>
              <div className="border-t border-border w-full my-3"></div>
            </div>
            
            <TokenSelector
              token={betaToken}
              amount={betaAmount}
              setAmount={setBetaAmount}
              balance={wallet.isConnected ? wallet.betaBalance : undefined}
            />
            
            <Button
              className="defi-button w-full mt-4"
              onClick={addLiquidity}
              disabled={isAddButtonDisabled}
            >
              {addButtonText}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="remove">
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">LP Tokens</span>
                {wallet.isConnected && (
                  <span className="text-sm text-muted-foreground">
                    Balance: {wallet.lpBalance}
                  </span>
                )}
              </div>
              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  value={lpAmount}
                  onChange={(e) => {
                    if (e.target.value === "" || /^[0-9]*[.,]?[0-9]*$/.test(e.target.value)) {
                      setLpAmount(e.target.value);
                    }
                  }}
                  placeholder="0.0"
                  className="defi-input bg-transparent border-0 focus:ring-0 p-0 text-2xl font-medium"
                />
                <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                  <span className="font-medium">LP</span>
                </div>
              </div>
              {wallet.isConnected && (
                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setLpAmount(wallet.lpBalance)}
                    className="text-xs bg-muted rounded px-2 py-1 text-primary hover:bg-primary/10 transition-colors"
                  >
                    MAX
                  </button>
                </div>
              )}
            </div>
            
            <div className="p-4 rounded-lg bg-muted/30 text-sm">
              <div className="text-center text-muted-foreground mb-3">
                You will receive:
              </div>
              <div className="flex justify-between mb-2">
                <span className="flex gap-1 items-center">
                  <div className="token-icon text-xs">{alphaToken.icon}</div>
                  <span>ALPHA</span>
                </span>
                <span className="text-foreground font-medium">
                  {lpAmount ? (parseInput(lpAmount) * parseInput(wallet.alphaBalance) / parseInput(wallet.lpBalance)).toFixed(4) : "0"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="flex gap-1 items-center">
                  <div className="token-icon text-xs">{betaToken.icon}</div>
                  <span>BETA</span>
                </span>
                <span className="text-foreground font-medium">
                  {lpAmount ? (parseInput(lpAmount) * parseInput(wallet.betaBalance) / parseInput(wallet.lpBalance)).toFixed(4) : "0"}
                </span>
              </div>
            </div>
            
            <Button
              className="defi-button w-full mt-4"
              onClick={removeLiquidity}
              disabled={isRemoveButtonDisabled}
            >
              {removeButtonText}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Liquidity;
