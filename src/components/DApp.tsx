"use client";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import abi from "../json/abi.json";
import Button from "./common/Button";
import NetworkInfo from "./common/NetworkInfo";
import ContractDetails from "./common/ContractDetails";
import WalletBalance from "./common/WalletBalance";

interface ContractDetails {
  name: string;
  symbol: string;
  balance: string;
}

interface WindowWithEthereum extends Window {
  ethereum?: ethers.Eip1193Provider;
}

const CONTRACT_ADDRESS = "0x7FFB3d637014488b63fb9858E279385685AFc1e2";

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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [network, setNetwork] = useState<string>("");
  const [isClient, setIsClient] = useState<boolean>(false);
  const [signature, setSignature] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletBalance, setWalletBalance] = useState<string>("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const disconnectWallet = () => {
    setDetails(null);
    setNetwork("");
    setSignature("");
    setWalletBalance("");
    setIsConnected(false);
  };

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

  const getWalletBalance = async (
    provider: ethers.BrowserProvider,
    address: string
  ) => {
    try {
      const balance = await provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (err) {
      console.error("Error getting wallet balance:", err);
      return "0";
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

      await windowWithEthereum.ethereum.request({
        method: "eth_requestAccounts",
      });

      const provider = new ethers.BrowserProvider(windowWithEthereum.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const networkInfo = await provider.getNetwork();
      setNetwork(networkInfo.name);
      console.log("Connected to network:", networkInfo);

      const code = await provider.getCode(CONTRACT_ADDRESS);
      if (code === "0x") {
        throw new Error(
          `Contract not found at address ${CONTRACT_ADDRESS} on network ${networkInfo.name}`
        );
      }

      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      const [name, symbol, contractBalance] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.balanceOf(address),
      ]);

      const walletBalance = await getWalletBalance(provider, address);

      setDetails({
        name,
        symbol,
        balance: ethers.formatEther(contractBalance),
      });
      setWalletBalance(walletBalance);
      setIsConnected(true);
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
      <div className="p-4 sm:p-6 w-full max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-4">
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 w-full max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center sm:text-left">
          Smart Contract Details
        </h1>
        {isConnected ? (
          <Button variant="danger" size="sm" onClick={disconnectWallet}>
            Disconnect
          </Button>
        ) : (
          <Button
            variant="success"
            size="sm"
            onClick={connectWallet}
            isLoading={isLoading}
          >
            Connect Wallet
          </Button>
        )}
      </div>

      {isConnected && (
        <div className="space-y-4">
          <NetworkInfo network={network} onSwitchNetwork={switchNetwork} />
          <WalletBalance balance={walletBalance} />

          {error ? (
            <div className="p-3 sm:p-4 bg-red-50 rounded-lg">
              <p className="text-sm sm:text-base text-red-600">{error}</p>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : details ? (
            <ContractDetails
              contractAddress={CONTRACT_ADDRESS}
              name={details.name}
              symbol={details.symbol}
              balance={details.balance}
              onSignMessage={signMessage}
              signature={signature}
            />
          ) : null}
        </div>
      )}

      {!isConnected && !isLoading && (
        <div className="text-center py-6 sm:py-8">
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Connect your wallet to view contract details
          </p>
        </div>
      )}
    </div>
  );
};

export default DApp;
