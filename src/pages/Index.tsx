
import React from "react";
import { DefiProvider } from "../context/DefiContext";
import Header from "../components/Header";
import Swap from "../components/Swap";
import Liquidity from "../components/Liquidity";
import PoolInfo from "../components/PoolInfo";
import Wallet from "../components/Wallet";

const Index: React.FC = () => {
  return (
    <DefiProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        
        <main className="flex-1 container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Swap />
                <Liquidity />
              </div>
              <PoolInfo />
            </div>
            <div>
              <Wallet />
            </div>
          </div>
          
          <footer className="mt-16 text-center text-sm text-muted-foreground">
            <p>Alpha-Beta Swap &copy; 2025</p>
            <p className="mt-1">A simple AMM implementation using the Constant Product Formula</p>
          </footer>
        </main>
      </div>
    </DefiProvider>
  );
};

export default Index;
