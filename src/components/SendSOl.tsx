import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useEffect, useState } from "react";
import { Buffer } from "buffer";

if (typeof window !== "undefined") {
  window.Buffer = Buffer;
}

export const SendSol = () => {
  const { publicKey, sendTransaction, connected } = useWallet();
  const { connection } = useConnection();
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sucess, setSuccess] = useState(false);

  useEffect(() => {
    if (!connected) {
      setError("Please connect your wallet.");
    } else {
      setError(null);
    }
  }, [connected]);

  const sendToken = async () => {
    setError(null);
    setSuccess(false);

    if (!connected || !publicKey) {
      setError("Wallet not connected");
      return;
    }

    if (!toAddress) {
      setError("Recipient address is required");
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Invalid amount");
      return;
    }

    const amountInLamports = Number(amount) * LAMPORTS_PER_SOL;

    try {
      const recipientPubKey = new PublicKey(toAddress);
      console.log("==============================");
      console.log(recipientPubKey);
      console.log(toAddress);
      console.log("==============================");
      const balance = await connection.getBalance(publicKey);

      if (balance < amountInLamports) {
        setError("Insufficient Balance.");
        return;
      }

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubKey,
          lamports: amountInLamports,
        }),
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signature = await sendTransaction(transaction, connection);
      const confirmation = await connection.confirmTransaction(
        signature,
        "confirmed",
      );

      if (confirmation.value.err) {
        throw new Error("Transaction failed to confirm");
      }

      setSuccess(true);
      setToAddress("");
      setAmount("");
    } catch (error) {
      console.error("Transaction error:", error);
      setError(
        `Transaction failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  return (
    <div>
      <div className="max-w-md mx-auto p-4 border border-gray-300 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Send SOL</h2>
        {error && <p>Error: {error}</p>}
        {sucess && <p>SUccess: {sucess}</p>}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="toAddress"
              className="block text-sm font-medium text-gray-700"
            >
              Recipient Address
            </label>
            <input
              id="toAddress"
              type="text"
              placeholder="Enter recipient's SOL address"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Amount (SOL)
            </label>
            <input
              id="amount"
              type="text"
              placeholder="Enter amount in SOL"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <button
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={sendToken}
          >
            Send SOL
          </button>
        </div>
      </div>
    </div>
  );
};
