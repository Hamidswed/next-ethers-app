import React from "react";

interface WalletBalanceProps {
  balance: string;
}

const WalletBalance: React.FC<WalletBalanceProps> = ({ balance }) => {
  return (
    <div className="p-2 sm:p-3 bg-purple-50 rounded">
      <p className="text-xs sm:text-sm text-purple-600">
        Wallet Balance: <span className="font-medium">{balance} MATIC</span>
      </p>
    </div>
  );
};

export default WalletBalance;
