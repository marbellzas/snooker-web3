import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const SNK_CONTRACT = '0x677a6A0Ed9B73892e95076361F2d2DbeC6D54e30';
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

declare global {
  interface Window {
    ethereum?: import('ethers').Eip1193Provider;
  }
}

export default function PlayerProfile() {
  const [address, setAddress] = useState('');
  const [bnbBalance, setBnbBalance] = useState('');
  const [snkBalance, setSnkBalance] = useState('');
  const [snkSymbol, setSnkSymbol] = useState('SNK');

  useEffect(() => {
    const loadProfile = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const addr = await signer.getAddress();
        setAddress(addr);

        // ✅ ดึง BNB
        const bnb = await provider.getBalance(addr);
        setBnbBalance(ethers.formatEther(bnb));

        // ✅ ดึง SNK Token
        const token = new ethers.Contract(SNK_CONTRACT, ERC20_ABI, provider);
        const [rawBal, decimals, symbol] = await Promise.all([
          token.balanceOf(addr),
          token.decimals(),
          token.symbol(),
        ]);

        const formatted = ethers.formatUnits(rawBal, decimals);
        setSnkBalance(formatted);
        setSnkSymbol(symbol);
      }
    };

    loadProfile();
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl text-white">
      <h2 className="text-2xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
        👤 Player Profile
      </h2>

      <div className="space-y-4 text-sm">
        <div className="bg-white/10 p-4 rounded-xl border border-white/10">
          <p className="text-gray-400">Wallet Address:</p>
          <p className="font-mono text-blue-300 break-all">{address}</p>
        </div>

        <div className="bg-white/10 p-4 rounded-xl border border-white/10">
          <p className="text-gray-400">BNB Balance:</p>
          <p className="text-green-300 font-semibold">{bnbBalance} BNB</p>
        </div>

        <div className="bg-white/10 p-4 rounded-xl border border-white/10">
          <p className="text-gray-400">{snkSymbol} Token Balance:</p>
          <p className="text-yellow-300 font-semibold">{snkBalance} {snkSymbol}</p>
        </div>

        <div className="flex gap-2 mt-4">
          <button className="w-full bg-gradient-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 text-white font-semibold py-2 rounded-xl shadow">
            View Portfolio
          </button>
          <button className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-2 rounded-xl border border-white/20 shadow-inner">
            Game Stats
          </button>
        </div>
      </div>
    </div>
  );
}
