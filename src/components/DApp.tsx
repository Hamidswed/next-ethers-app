"use client";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import abi from "../json/abi.json"; // ABI of your contract

interface ContractDetails {
  name: string;
  symbol: string;
  balance: string;
}

interface WindowWithEthereum extends Window {
  ethereum?: ethers.Eip1193Provider;
}

const CONTRACT_ADDRESS = "0x7FFB3d637014488b63fb9858E279385685AFc1e2"; // Address of your contract

const POLYGON_MAINNET = {
  chainId: "0x89",
  chainName: "Polygon Mainnet",
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
  },
  rpcUrls: ["https://polygon-rpc.com"],
  blockExplorerUrls: ["https://polygonscan.com/"],
};

const DApp: React.FC = () => {
  const [details, setDetails] = useState<ContractDetails | null>(null);
  const [error, setError] = useState<string | null>(null); // For managing errors
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [network, setNetwork] = useState<string>("");
  const [isClient, setIsClient] = useState<boolean>(false);
  const [signature, setSignature] = useState<string>("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const addPolygonNetwork = async () => {
    try {
      await window.ethereum?.request({
        method: "wallet_addEthereumChain",
        params: [POLYGON_MAINNET],
      });
    } catch (err) {
      console.error("Error adding Polygon network:", err);
    }
  };

  const switchNetwork = async (chainId: string) => {
    try {
      await window.ethereum?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });
    } catch (err: unknown) {
      const error = err as { code?: number };
      if (error.code === 4902) {
        await addPolygonNetwork();
      } else {
        console.error("Error switching network:", err);
        setError("Error switching network");
      }
    }
  };

  const signMessage = async () => {
    try {
      const windowWithEthereum = window as WindowWithEthereum;
      if (!windowWithEthereum.ethereum) {
        throw new Error("Please install MetaMask");
      }

      const provider = new ethers.BrowserProvider(windowWithEthereum.ethereum);
      const signer = await provider.getSigner();

      const message = "Hello, this is a test message to sign!";
      const signature = await signer.signMessage(message);
      setSignature(signature);
    } catch (err) {
      console.error("Error signing message:", err);
      setError(err instanceof Error ? err.message : "Error signing message");
    }
  };

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const windowWithEthereum = window as WindowWithEthereum;
      if (!windowWithEthereum.ethereum) {
        throw new Error("Please install MetaMask");
      }

      // Request account access
      await windowWithEthereum.ethereum.request({
        method: "eth_requestAccounts",
      });

      const provider = new ethers.BrowserProvider(windowWithEthereum.ethereum);
      const signer = await provider.getSigner();

      // Get network information
      const networkInfo = await provider.getNetwork();
      setNetwork(networkInfo.name);
      console.log("Connected to network:", networkInfo);

      // Check if contract exists at the address
      const code = await provider.getCode(CONTRACT_ADDRESS);
      if (code === "0x") {
        throw new Error(
          `Contract not found at address ${CONTRACT_ADDRESS} on network ${networkInfo.name}`
        );
      }

      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      // Get contract details
      const [name, symbol, address] = await Promise.all([
        contract.name(),
        contract.symbol(),
        signer.getAddress(),
      ]);

      const balance = await contract.balanceOf(address);

      setDetails({
        name,
        symbol,
        balance: ethers.formatEther(balance), // Convert balance to ETH
      });
    } catch (err) {
      console.error("Error connecting to wallet:", err);
      setError(
        err instanceof Error ? err.message : "Error connecting to wallet"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isClient) {
      connectWallet();
    }
  }, [isClient]);

  if (!isClient) {
    return (
      <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-4">
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-bold text-gray-800">
        Smart Contract Details
      </h1>

      <div className="p-2 bg-blue-50 rounded">
        <p className="text-sm text-blue-600">
          Current Network: <span className="font-medium">{network}</span>
        </p>
        <div className="mt-2 space-x-2">
          <button
            onClick={() => switchNetwork("0x89")}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Polygon Mainnet
          </button>
          <button
            onClick={() => switchNetwork("0x13881")}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Polygon Mumbai
          </button>
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : details ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">{details.name}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Symbol:</span>
              <span className="font-medium">{details.symbol}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Balance:</span>
              <span className="font-medium">{details.balance} MATIC</span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <button
              onClick={signMessage}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Sign Message
            </button>
            {signature && (
              <div className="mt-2 p-2 bg-gray-50 rounded">
                <p className="text-xs text-gray-600 break-all">{signature}</p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default DApp;
