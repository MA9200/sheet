"use client";
import { useState } from "react";
import Link from "next/link"; // ✅ Import Next.js Link
import WalletConnect from "./components/WalletConnect";
import UpdateAsset from "./components/UpdateAsset"; // ✅ Import UpdateAsset

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Crypto Portfolio Manager</h1>
      <WalletConnect onConnect={setWalletAddress} />

      {/* Show Update Asset UI only if wallet is connected */}
      {walletAddress && <UpdateAsset walletAddress={walletAddress} />}

      {/* Navigation Buttons (Removed extra links) */}
      <div className="mt-6 flex space-x-4">
        <Link href="/portfolio">
          <button className="px-4 py-2 bg-green-500 text-white rounded">View Portfolio</button>
        </Link>
      </div>
    </div>
  );
}
