
import React from "react";
import { TokenInfo } from "../types/defi";
import { formatNumber } from "../utils/defiUtils";

interface TokenSelectorProps {
  token: TokenInfo;
  amount: string;
  setAmount: (value: string) => void;
  balance?: string;
  readonly?: boolean;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({
  token,
  amount,
  setAmount,
  balance,
  readonly = false
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]*[.,]?[0-9]*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleMaxClick = () => {
    if (balance) {
      setAmount(balance);
    }
  };

  return (
    <div className="p-4 rounded-lg bg-muted/50 border border-border">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-muted-foreground">Amount</span>
        {balance && (
          <span className="text-sm text-muted-foreground">
            Balance: {formatNumber(balance)}
          </span>
        )}
      </div>
      <div className="flex gap-3 items-center">
        <input
          type="text"
          value={amount}
          onChange={handleInputChange}
          placeholder="0.0"
          className="defi-input bg-transparent border-0 focus:ring-0 p-0 text-2xl font-medium"
          disabled={readonly}
        />
        <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
          <div className="token-icon text-base">
            {token.icon || token.symbol.charAt(0)}
          </div>
          <span className="font-medium">{token.symbol}</span>
        </div>
      </div>
      {balance && !readonly && (
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={handleMaxClick}
            className="text-xs bg-muted rounded px-2 py-1 text-primary hover:bg-primary/10 transition-colors"
          >
            MAX
          </button>
        </div>
      )}
    </div>
  );
};

export default TokenSelector;
