import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ChangeEvent, useState } from "react";

export const AirDrop = () => {
  const [amount, setAmount] = useState<number>(0);
  const wallet = useWallet();
  const { connection } = useConnection();

  const sendAirDropToUser = async () => {
    if (wallet.publicKey) {
      try {
        const signature = await connection.requestAirdrop(
          wallet.publicKey,
          amount,
        );
        await connection.confirmTransaction(signature);
        console.log(`AirDrop of ${amount / 1e9} SOL successfull!`);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Error! Wallet not connected.");
    }
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    const solAmount = parseFloat(inputValue) || 0;

    const lamports = Math.floor(solAmount * 1e9);
    setAmount(lamports);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <h1 className="text-2xl font-bold ">Air drop</h1>
      <div className="flex flex-col gap-2 items-center">
        <p>{wallet.publicKey?.toString()}</p>
        <input
          type="number"
          placeholder="Amount in SOL"
          value={amount / 1e9} // Display in SOL
          onChange={handleAmountChange}
          className="border bg-gray-300 p-2 rounded-md"
          min="0"
          step="0.000000001"
        />
        <button
          className="bg-gray-300 rounded-md p-2"
          onClick={sendAirDropToUser}
        >
          Send
        </button>
      </div>
    </div>
  );
};
