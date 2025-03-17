import React from "react";
import Button from "./Button";

interface NetworkInfoProps {
  network: string;
  onSwitchNetwork: (chainId: string) => void;
}

const NetworkInfo: React.FC<NetworkInfoProps> = ({
  network,
  onSwitchNetwork,
}) => {
  return (
    <div className="p-2 sm:p-3 bg-blue-50 rounded">
      <p className="text-xs sm:text-sm text-blue-600">
        Current Network: <span className="font-medium">{network}</span>
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onSwitchNetwork("0x89")}
          className="flex-1 sm:flex-none"
        >
          Polygon Mainnet
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onSwitchNetwork("0x13881")}
          className="flex-1 sm:flex-none"
        >
          Polygon Mumbai
        </Button>
      </div>
    </div>
  );
};

export default NetworkInfo;
