import { useEffect,useState } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast'; 
import GameLobby from './components/GameLobby';

declare global {
  interface Window {
    ethereum?: import('ethers').Eip1193Provider;
    snkIntervalId?: number; // ✅ เพิ่มตัวแปรนี้
  }
  interface Window {
    ethereum?: import('ethers').Eip1193Provider;
  }
}
export default function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [network, setNetwork] = useState('');
  const [snkBalance, setSnkBalance] = useState('');
  const SNK_CONTRACT = '0x677a6A0Ed9B73892e95076361F2d2DbeC6D54e30';
  const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)"
  ];

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast.error('กรุณาติดตั้ง MetaMask ก่อนใช้งาน!');
        return;
      }
  
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
  
      const net = await provider.getNetwork();
      setNetwork(net.name || `Chain ID: ${net.chainId}`);
  
      toast.success('🔗 Wallet Connected');
      localStorage.removeItem('wallet_disconnected');
  
      await loadSNKBalance(address); // ✅ โหลดตอนแรก
  
      // ✅ ตั้ง interval ทุก 10 วินาที
      const intervalId = setInterval(() => {
        loadSNKBalance(address);
      }, 10000);
  
      // ✅ เก็บไว้ใน window เพื่อ clear ตอน disconnect
      (window as any).snkIntervalId = intervalId;
  
    } catch (err) {
      console.error('Wallet connection error:', err);
      toast.error('❌ Wallet connection failed');
    }
  };

  const loadSNKBalance = async (addr: string) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const token = new ethers.Contract(SNK_CONTRACT, ERC20_ABI, provider);
      const [rawBal, decimals] = await Promise.all([
        token.balanceOf(addr),
        token.decimals(),
      ]);
      const formatted = ethers.formatUnits(rawBal, decimals);
      setSnkBalance(formatted);
    } catch (err) {
      console.error("Error loading SNK balance:", err);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress('');
    setNetwork('');
    setSnkBalance('');
    localStorage.setItem('wallet_disconnected', 'true');
  
    if ((window as any).snkIntervalId) {
      clearInterval((window as any).snkIntervalId);
    }
  
    toast('🔌 Wallet disconnected', {
      icon: '🔌',
      style: {
        background: '#333',
        color: '#fff',
      },
    });
    setTimeout(() => window.location.reload(), 500);
  };


 // ✅ Auto Connect เมื่อเปิดเว็บ
 useEffect(() => {
  const checkConnection = async () => {
    try {
      // ✅ ถ้า user เคย disconnect → ข้าม
      const disconnected = localStorage.getItem('wallet_disconnected');
      if (disconnected === 'true') return;

      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_accounts', []);
        if (accounts.length > 0) {
          const address = accounts[0];
          setWalletAddress(address);
          const net = await provider.getNetwork();
          setNetwork(net.name || `Chain ID: ${net.chainId}`);
        }
      }
    } catch (err) {
      console.error('Auto connect error:', err);
    }
  };

  checkConnection();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 via-black to-blue-900 animate-gradient bg-[length:400%_400%] relative text-white">
  
      {/* ✅ ข้อมูล Wallet แบบแนวนอน */}
      {walletAddress && (
        <div className="w-full max-w-6xl mx-auto px-6 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow text-sm">
            <div className="flex flex-col">
              <span className="text-gray-400">Address</span>
              <span className="font-mono text-blue-300">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400">Network</span>
              <span className="text-green-400">{network}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400">SNK</span>
              <span className="text-yellow-300 font-bold">
                {parseFloat(snkBalance).toFixed(2)} SNK
              </span>
            </div>
            <button
              onClick={disconnectWallet}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl shadow text-white font-semibold text-sm"
            >
              🔌 Disconnect
            </button>
          </div>
        </div>
      )}
  
      {/* ✅ Main Content */}
      <div className="pt-12 px-6">
        {!walletAddress ? (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl p-8 max-w-md w-full mx-auto text-center">
            <h1 className="text-4xl font-extrabold mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-cyan-400">
              Snooker Web3 🎱
            </h1>
            <p className="text-gray-400 mt-6">กรุณาเชื่อมต่อ MetaMask เพื่อเริ่มใช้งาน</p>
            <p className="text-gray-400 mt-6">เล่นสนุกเกอร์ออนไลน์กับเพื่อนๆ</p>
            <button
              onClick={connectWallet}
              className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl shadow-lg text-sm font-semibold"
            >
              🔌 Connect Wallet
            </button>
          </div>
        ) : (
          <GameLobby />
        )}
      </div>
    </div>
  );
}