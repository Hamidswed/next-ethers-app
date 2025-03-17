import React from "react";
import Button from "./Button";

interface ContractDetailsProps {
  contractAddress: string;
  name: string;
  symbol: string;
  balance: string;
  onSignMessage: () => void;
  signature?: string;
}

const ContractDetails: React.FC<ContractDetailsProps> = ({
  contractAddress,
  name,
  symbol,
  balance,
  onSignMessage,
  signature,
}) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 bg-gray-50 rounded">
          <span className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-0">
            Contract Address:
          </span>
          <span className="font-medium text-xs sm:text-sm break-all">
            {contractAddress}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 bg-gray-50 rounded">
          <span className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-0">
            Name:
          </span>
          <span className="font-medium text-xs sm:text-sm">{name}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 bg-gray-50 rounded">
          <span className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-0">
            Symbol:
          </span>
          <span className="font-medium text-xs sm:text-sm">{symbol}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 bg-gray-50 rounded">
          <span className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-0">
            Balance:
          </span>
          <span className="font-medium text-xs sm:text-sm">
            {balance} MATIC
          </span>
        </div>
      </div>

      <div className="pt-3 sm:pt-4 border-t">
        <Button variant="success" onClick={onSignMessage} className="w-full">
          Sign Message
        </Button>
        {signature && (
          <div className="mt-2 p-2 sm:p-3 bg-gray-50 rounded">
            <p className="text-xs text-gray-600 break-all">{signature}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractDetails;
