"use client";
import { useState } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x83A3DE97275799aCfaffC449E42074e716440fF0"; // Ensure this is correct

const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "symbol", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "PortfolioUpdated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "getPortfolio",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "symbol", "type": "string" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "internalType": "struct CryptoPortfolio.Asset[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_symbol", "type": "string" },
      { "internalType": "uint256", "name": "_amount", "type": "uint256" }
    ],
    "name": "updateAsset",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export default function UpdateAsset({ walletAddress }: { walletAddress: string }) {
  const [symbol, setSymbol] = useState("");
  const [amount, setAmount] = useState("");

  const updateAsset = async () => {
    if (!walletAddress) {
      alert("❌ Please connect your wallet first!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner(); // ✅ Get signer for transaction
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      console.log("📢 Sending transaction to smart contract...");
      const tx = await contract.updateAsset(symbol, Number(amount));
      await tx.wait(); // ✅ Wait for confirmation
      alert(`✅ Asset Updated: ${symbol} - ${amount}`);
    } catch (error) {
      console.error("⚠️ Error updating asset:", error);
      alert("❌ Failed to update asset. Check console for details.");
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <h2 className="text-xl font-semibold mb-2">Update Asset</h2>

      <input
        type="text"
        placeholder="Asset Symbol (e.g., ETH)"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />
      
      <button
        onClick={updateAsset}
        className="px-4 py-2 bg-blue-500 text-white rounded w-full"
      >
        Update Asset
      </button>
    </div>
  );
}
