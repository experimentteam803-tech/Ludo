import React, { useState } from 'react';
import { X } from 'lucide-react';
import { GameMode, PlayerColor } from '../../types/game';
import { useAuthStore } from '../../stores/useAuthStore';

interface Props {
  mode: GameMode;
  onClose: () => void;
  onStart: (players: any[], fee: number, prize: number) => void;
}

export const BetSelectionModal: React.FC<Props> = ({ mode, onClose, onStart }) => {
  const [selectedPlayerCount, setSelectedPlayerCount] = useState<2 | 4>(2);
  const { user, updateCoins } = useAuthStore();

  const stakes = [
    { entry: 0, prize: 0, label: 'Free' },
    { entry: 10, prize: 17, label: 'Entry: ₹10' },
    { entry: 100, prize: 170, label: 'Entry: ₹100' },
    { entry: 500, prize: 850, label: 'Entry: ₹500' },
    { entry: 1000, prize: 1700, label: 'Entry: ₹1,000' },
    { entry: 5000, prize: 8500, label: 'Entry: ₹5,000' },
  ];

  const handleSelectStake = (entry: number, prize: number) => {
    if (user && user.virtualCoins < entry) {
      alert('Insufficient Virtual Coins. Watch an ad or claim bonus in the store!');
      return;
    }
    updateCoins(-entry);

    const colors: PlayerColor[] = ['RED', 'YELLOW', 'GREEN', 'BLUE'];
    const players = [
      { id: user?.uid || 'p1', name: user?.displayName || 'You', color: colors[0], isAi: false },
      { id: 'ai_1', name: 'Robot Alpha', color: colors[1], isAi: true },
    ];
    if (selectedPlayerCount === 4) {
      players.push(
        { id: 'ai_2', name: 'Robot Beta', color: colors[2], isAi: true },
        { id: 'ai_3', name: 'Robot Gamma', color: colors[3], isAi: true }
      );
    }

    onStart(players, entry, prize);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3">
      <div className="bg-[#0e1a30] border-2 border-yellow-400 rounded-2xl w-full max-w-sm overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-3 border-b border-yellow-500/30 bg-[#091122]">
          <h2 className="text-sm font-black text-yellow-400">LUDO {mode.replace('_', ' ')}</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        {/* Player Count Select */}
        <div className="p-3">
          <p className="text-[11px] text-gray-400 text-center mb-2 font-bold uppercase">SELECT PLAYERS</p>
          <div className="flex gap-3">
            {[2, 4].map((cnt) => (
              <button
                key={cnt}
                onClick={() => setSelectedPlayerCount(cnt as 2 | 4)}
                className={`flex-1 py-2 rounded-xl font-black text-sm border ${
                  selectedPlayerCount === cnt
                    ? 'bg-yellow-400 text-gray-950 border-yellow-300'
                    : 'bg-[#15233e] text-white border-gray-700'
                }`}
              >
                {cnt} Players
              </button>
            ))}
          </div>
        </div>

        {/* Stake Grid */}
        <div className="p-3 overflow-y-auto grid grid-cols-2 gap-2">
          {stakes.map((stk) => (
            <button
              key={stk.entry}
              onClick={() => handleSelectStake(stk.entry, stk.prize)}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-gradient-to-b from-[#1b2b48] to-[#111c30] border border-yellow-500/40 hover:border-yellow-400 shadow active:scale-95 transition-transform"
            >
              <span className="text-[10px] text-gray-300">Prize Pool</span>
              <span className="text-base font-extrabold text-yellow-400 font-mono">₹{stk.prize}</span>
              <span className="mt-1 text-[11px] font-bold px-2 py-0.5 rounded bg-black/40 text-gray-200">
                {stk.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
