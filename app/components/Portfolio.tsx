"use client";
import { useState, useEffect } from "react";
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

export default function Portfolio({ walletAddress }: { walletAddress: string }) {
  const [portfolio, setPortfolio] = useState<{ symbol: string; amount: number }[]>([]);
  const [loading, setLoading] = useState(true); // Added loading state

  async function getPortfolio() {
    if (!walletAddress) {
      console.log("❌ No wallet connected. Skipping fetch.");
      return;
    }

    try {
      setLoading(true);
      console.log("🔄 Fetching portfolio from blockchain...");
      
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      const assets = await contract.getPortfolio();
      console.log("✅ Portfolio Fetched:", assets);

      const formattedAssets = assets.map((asset: any) => ({
        symbol: asset.symbol,
        amount: Number(asset.amount),
      }));

      setPortfolio(formattedAssets);
    } catch (error) {
      console.error("⚠️ Error fetching portfolio:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getPortfolio();
  }, [walletAddress, getPortfolio]);
  

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-2">Your Crypto Portfolio</h2>
      <p className="text-gray-500">Wallet: {walletAddress || "Not Connected"}</p>

      {loading ? (
        <p className="text-blue-500 mt-4">Loading portfolio...</p>
      ) : (
        <table className="table-auto w-full border mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Asset</th>
              <th className="border p-2">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.length > 0 ? (
              portfolio.map((asset, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border p-2">{asset.symbol.toUpperCase()}</td>
                  <td className="border p-2">{asset.amount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="border p-2 text-center">No assets found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
