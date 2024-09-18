import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

export const UserBalance = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(0);

  const getCryptoBalance = async () => {
    if (wallet.publicKey) {
      try {
        const balance = await connection.getBalance(wallet.publicKey);
        setBalance(balance / 1e9);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("error");
    }
  };

  useEffect(() => {
    getCryptoBalance();
  }, []);

  return (
    <div>
      <h1>User Balande</h1>
      <div>{balance}</div>
    </div>
  );
};
