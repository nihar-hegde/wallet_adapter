import { useConnection, useWallet } from "@solana/wallet-adapter-react";

export const AirDrop = () => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const sendAirDropToUser = async () => {
    if (wallet.publicKey) {
      await connection.requestAirdrop(wallet.publicKey, 2000000000);
    } else {
      console.log("Error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <h1 className="text-2xl font-bold ">Air drop</h1>
      <div className="flex flex-col gap-2 items-center">
        <p>{wallet.publicKey?.toString()}</p>
        <input
          type="text"
          placeholder="Amount"
          className="border bg-gray-300 p-2 rounded-md"
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
