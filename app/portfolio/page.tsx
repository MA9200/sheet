"use client";
import { useState, useEffect } from "react";
import Portfolio from "../components/Portfolio"; // ✅ Ensure correct import

export default function PortfolioPage() {
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(true);

  const getWalletAddress = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      } catch (error) {
        console.error("⚠️ Error fetching wallet address:", error);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    getWalletAddress();

    // ✅ Add event listener for account changes
    const handleAccountsChanged = (accounts: string[]) => {
      setWalletAddress(accounts.length > 0 ? accounts[0] : "");
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    // ✅ Cleanup function to remove event listener
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">My Crypto Portfolio</h1>

      {/* Show wallet connection status */}
      {loading ? (
        <p className="text-blue-500">Loading...</p>
      ) : !walletAddress ? (
        <div className="text-red-500">
          <p>❌ Wallet not connected. Please return to the home page and connect.</p>
        </div>
      ) : (
        <Portfolio walletAddress={walletAddress} />
      )}
    </div>
  );
}
