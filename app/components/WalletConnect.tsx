"use client";
import { useState } from "react";
import { ethers } from "ethers";

export default function WalletConnect({ onConnect }: { onConnect: (address: string) => void }) {
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const address = accounts[0];

        setWalletAddress(address);
        onConnect(address); // Pass address to parent component
      } catch (error) {
        console.error("Wallet connection error:", error);
        alert("Failed to connect wallet! Check console for details.");
      }
    } else {
      alert("MetaMask is not installed. Please install MetaMask to connect.");
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md">
      {walletAddress ? (
        <p className="text-green-600">Connected: {walletAddress}</p>
      ) : (
        <button onClick={connectWallet} className="px-4 py-2 bg-blue-500 text-white rounded">
          Connect Wallet
        </button>
      )}
    </div>
  );
}
