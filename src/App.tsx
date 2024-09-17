import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { AirDrop } from "./components/AirDrop";

function App() {
  return (
    <ConnectionProvider
      endpoint={
        "https://solana-devnet.g.alchemy.com/v2/tqoA0HsqL3luasjokw97vxQxbgVyU_D6"
      }
    >
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <main className="flex flex-col gap-6 items-center justify-center p-20">
            <div className="flex flex-col items-center justify-center gap-2">
              <WalletMultiButton />
              <WalletDisconnectButton />
            </div>
            <div>
              <AirDrop />
            </div>
          </main>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
