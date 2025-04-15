
import React from "react";
import { useDefi } from "../context/DefiContext";
import { Wallet as WalletIcon, RefreshCw } from "lucide-react";

const Header: React.FC = () => {
  const { wallet, connectWallet, refreshPool, isLoading } = useDefi();
  
  return (
    <header className="py-4">
      <div className="container flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Alpha-Beta Swap
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            onClick={refreshPool}
            disabled={isLoading}
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          
          {!wallet.isConnected && (
            <button 
              className="defi-button py-2 px-4 flex items-center gap-2"
              onClick={connectWallet}
              disabled={isLoading}
            >
              <WalletIcon className="h-4 w-4" />
              <span>Connect</span>
            </button>
          )}
          
          {wallet.isConnected && (
            <div className="flex items-center gap-2 py-2 px-3 bg-muted rounded-lg border border-border">
              <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse-light"></div>
              <span className="text-sm font-medium">
                {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
