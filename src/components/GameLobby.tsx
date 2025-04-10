import LobbyChat from './LobbyChat'; // อย่าลืม import
const mockOnlineUsers = [
  '0x1234...abcd',
  '0xA1b2...Ff3D',
  '0xC0de...BEEF',
  '0x9999...DDDD',
];

const mockRooms = [
  { id: 1, name: 'Room 1', range: '1 - 5 SNK', players: 2 },
  { id: 2, name: 'Room 2', range: '5 - 20 SNK', players: 1 },
  { id: 3, name: 'Room 3', range: '20 - 50 SNK', players: 0 },
  { id: 4, name: 'Room 4', range: '50 - 100 SNK', players: 1 },
  { id: 5, name: 'VIP Room', range: '100+ SNK', players: 0 },
];

const mockTables = [
  {
    id: 'A',
    player1: '0x1234...abcd',
    player2: '0xA1b2...Ff3D',
    watchers: 3,
  },
  {
    id: 'B',
    player1: '0xC0de...BEEF',
    player2: '0x9999...DDDD',
    watchers: 1,
  },
];

export default function GameLobby() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1121] to-[#1c1f3b] p-6 text-white font-sans flex gap-6">
      {/* Sidebar: Online Users */}
      <div className="w-64 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 shadow-md">
        <h3 className="text-lg font-bold text-cyan-300 mb-4">🟢 Online Users</h3>
        <ul className="space-y-3">
          {mockOnlineUsers.map((user, index) => (
            <li
              key={index}
              className="bg-white/10 p-2 rounded-xl text-green-300 font-mono text-sm text-center"
            >
              {user}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content: Game Rooms + Chat */}
      <div className="flex-1 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl min-h-[600px] overflow-auto">
        <h1 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400 mb-8">
          Snooker Web3 🎱
        </h1>
        <h2 className="text-xl font-bold text-white mb-6 text-center">Game Rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockRooms.map((room) => (
            <div
              key={room.id}
              className="bg-white/10 rounded-xl p-4 border border-white/10 shadow flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-bold text-white">{room.name}</h3>
                <p className="text-sm text-gray-300">Bet: {room.range}</p>
                <p className="text-xs text-purple-300 mt-1">Players: {room.players}</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-semibold shadow">
                Join
              </button>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">
          เล่นสนุกเกอร์ออนไลน์กับเพื่อน ๆ และชิงรางวัล SNK 🪙
        </p>

        {/* ✅ ส่วนด้านล่าง: กล่องแชท */}
        <div className="mt-10">
          <LobbyChat walletAddress={"0x1234...abcd"} />
        </div>
      </div>

      {/* Right: Active Tables */}
      <div className="w-64 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 shadow-md">
        <h3 className="text-lg font-bold text-pink-300 mb-4">🎮 Active Tables</h3>
        <ul className="space-y-3">
          {mockTables.map((table) => (
            <li
              key={table.id}
              className="bg-white/10 p-3 rounded-xl border border-white/10"
            >
              <p className="text-sm mb-1">
                <strong>Table {table.id}</strong><br />
                {table.player1} vs {table.player2}
              </p>
              <p className="text-xs text-gray-400">👁 Watching: {table.watchers}</p>
              <button className="mt-2 w-full py-1 text-xs bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20">
                Watch
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}