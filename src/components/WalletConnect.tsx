import { useState } from 'react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: import('ethers').Eip1193Provider;
  }
}

export default function WalletConnect() {
  const [walletAddress, setWalletAddress] = useState('');
  const [network, setNetwork] = useState('');

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("กรุณาติดตั้ง MetaMask ก่อนใช้งาน!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);

      const net = await provider.getNetwork();
      setNetwork(net.name || `Chain ID: ${net.chainId}`);
    } catch (err) {
      console.error("Wallet connection error:", err);
    }
  };

  return (
    <div className="backdrop-blur-lg bg-white/5 border border-white/10 shadow-2xl rounded-2xl p-6 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-extrabold text-center text-white mb-5 tracking-tight">
        🦊 Connect Your Wallet
      </h2>

      <button
        onClick={connectWallet}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg font-semibold rounded-xl shadow-md transition-all duration-200"
      >
        {walletAddress ? '✅ Connected' : '🔌 Connect MetaMask'}
      </button>

      {walletAddress && (
        <div className="mt-5 text-white text-sm bg-white/10 p-4 rounded-xl shadow-inner space-y-2 text-center border border-white/10">
          <div>
            <span className="text-gray-400">Address:</span>
            <p className="font-mono text-blue-300 break-all">{walletAddress}</p>
          </div>
          <div>
            <span className="text-gray-400">Network:</span>
            <p className="text-green-400">{network}</p>
          </div>
        </div>
      )}
    </div>
  );
}
