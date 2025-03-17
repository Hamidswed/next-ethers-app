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
    <div className="p-2 bg-blue-50 rounded">
      <p className="text-sm text-blue-600">
        Current Network: <span className="font-medium">{network}</span>
      </p>
      <div className="mt-2 space-x-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onSwitchNetwork("0x89")}
        >
          Polygon Mainnet
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onSwitchNetwork("0x13881")}
        >
          Polygon Mumbai
        </Button>
      </div>
    </div>
  );
};

export default NetworkInfo;
