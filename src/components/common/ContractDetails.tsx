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
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
          <span className="text-gray-600">Contract Address:</span>
          <span className="font-medium text-sm break-all">
            {contractAddress}
          </span>
        </div>
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
          <span className="text-gray-600">Name:</span>
          <span className="font-medium">{name}</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
          <span className="text-gray-600">Symbol:</span>
          <span className="font-medium">{symbol}</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
          <span className="text-gray-600">Balance:</span>
          <span className="font-medium">{balance} MATIC</span>
        </div>
      </div>

      <div className="pt-4 border-t">
        <Button variant="success" onClick={onSignMessage} className="w-full">
          Sign Message
        </Button>
        {signature && (
          <div className="mt-2 p-2 bg-gray-50 rounded">
            <p className="text-xs text-gray-600 break-all">{signature}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractDetails;
