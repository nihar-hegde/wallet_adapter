import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useCallback, useEffect, useState } from "react";

export const UserBalance = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const getCryptoBalance = useCallback(async () => {
    if (!publicKey) {
      setError("Wallet not connected");
      return;
    }

    try {
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / LAMPORTS_PER_SOL);
      setError(null);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setError("Failed to fetch balance");
    }
  }, [publicKey, connection]);

  useEffect(() => {
    getCryptoBalance();
    const intervalId = setInterval(getCryptoBalance, 30000);
    return () => clearInterval(intervalId);
  }, [getCryptoBalance]);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">User Balance</h1>
      {error ? (
        <div>{error}</div>
      ) : balance !== null ? (
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <p className="text-lg font-semibold">{balance.toFixed(4)} SOL</p>
        </div>
      ) : (
        <p className="text-gray-500">Loading balance...</p>
      )}
      <button
        onClick={getCryptoBalance}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Refresh Balance
      </button>
    </div>
  );
};
