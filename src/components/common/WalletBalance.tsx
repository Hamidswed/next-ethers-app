import React from "react";

interface WalletBalanceProps {
  balance: string;
  address: string;
}

const WalletBalance: React.FC<WalletBalanceProps> = ({ balance, address }) => {
  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="p-2 sm:p-3 bg-purple-50 rounded">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <p className="text-xs sm:text-sm text-purple-600">
          MetaMask Wallet:{" "}
          <span className="font-medium">{shortenAddress(address)}</span>
        </p>
        <p className="text-xs sm:text-sm text-purple-600">
          Balance: <span className="font-medium">{balance} MATIC</span>
        </p>
      </div>
    </div>
  );
};

export default WalletBalance;
