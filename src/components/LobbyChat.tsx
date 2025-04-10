import { useState } from "react";

export default function LobbyChat({ walletAddress }: { walletAddress: string }) {
  const [messages, setMessages] = useState([
    { sender: "0x1234...abcd", text: "ใครจะลงห้อง 1 บ้าง?" },
    { sender: "0xBEEF...D00D", text: "กำลังเข้าเลยครับ" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: walletAddress, text: input }]);
    setInput("");
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 w-full bg-white/5 border border-white/10 rounded-xl shadow-lg p-4 flex flex-col h-80">
      <h3 className="text-pink-400 font-bold mb-2 text-sm">💬 Lobby Chat</h3>
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {messages.map((msg, index) => (
          <div key={index}>
            <span className="text-xs text-blue-400 font-mono">{msg.sender}</span>
            <p className="text-sm text-white bg-white/10 p-2 rounded-xl mt-1 w-fit max-w-xs">{msg.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-sm text-white placeholder-gray-400"
          placeholder="พิมพ์ข้อความ..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white text-sm font-semibold"
        >
          ส่ง
        </button>
      </div>
    </div>
  );
}
