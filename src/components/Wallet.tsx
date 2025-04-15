
import React from "react";
import { Button } from "@/components/ui/button";
import { useDefi } from "../context/DefiContext";
import { formatNumber } from "../utils/defiUtils";
import { Wallet as WalletIcon } from "lucide-react";

const Wallet: React.FC = () => {
  const { wallet, connectWallet, disconnectWallet, isLoading } = useDefi();
  
  return (
    <div className="defi-card p-5">
      {wallet.isConnected ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Connected Wallet</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={disconnectWallet}
            >
              Disconnect
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <WalletIcon className="h-4 w-4" />
            <span>
              {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
            </span>
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">ALPHA Balance</div>
              <div className="text-sm font-medium">{formatNumber(wallet.alphaBalance)}</div>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">BETA Balance</div>
              <div className="text-sm font-medium">{formatNumber(wallet.betaBalance)}</div>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">LP Balance</div>
              <div className="text-sm font-medium">{formatNumber(wallet.lpBalance)}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <WalletIcon className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <h2 className="text-lg font-medium mb-3">Wallet</h2>
          <Button 
            className="defi-button w-full" 
            disabled={isLoading} 
            onClick={connectWallet}
          >
            {isLoading ? "Connecting..." : "Connect Wallet"}
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            Connect your wallet to use the app
          </p>
        </div>
      )}
    </div>
  );
};

export default Wallet;
