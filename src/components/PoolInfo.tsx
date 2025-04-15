
import React from "react";
import { useDefi } from "../context/DefiContext";
import { formatNumber } from "../utils/defiUtils";

const PoolInfo: React.FC = () => {
  const { pool } = useDefi();
  
  return (
    <div className="defi-card p-4">
      <h2 className="text-lg font-medium mb-4">Pool Information</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/30 rounded-lg p-3">
          <div className="text-sm text-muted-foreground mb-1">Alpha Reserve</div>
          <div className="text-lg font-medium">{formatNumber(pool.alphaReserve)}</div>
        </div>
        
        <div className="bg-muted/30 rounded-lg p-3">
          <div className="text-sm text-muted-foreground mb-1">Beta Reserve</div>
          <div className="text-lg font-medium">{formatNumber(pool.betaReserve)}</div>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-muted/30 rounded-lg p-3">
          <div className="text-sm text-muted-foreground mb-1">Exchange Rate</div>
          <div className="text-lg font-medium">1 ALPHA = {formatNumber(pool.exchangeRate)} BETA</div>
        </div>
        
        <div className="bg-muted/30 rounded-lg p-3">
          <div className="text-sm text-muted-foreground mb-1">LP Fee</div>
          <div className="text-lg font-medium">{pool.fee}%</div>
        </div>
      </div>
      
      <div className="mt-4 bg-muted/30 rounded-lg p-3">
        <div className="text-sm text-muted-foreground mb-1">Total LP Tokens</div>
        <div className="text-lg font-medium">{formatNumber(pool.totalSupply)}</div>
      </div>
    </div>
  );
};

export default PoolInfo;
