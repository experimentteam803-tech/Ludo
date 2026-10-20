import React, { useState } from 'react';
import { X, Play } from 'lucide-react';
import { PlayerColor } from '../../types/game';

interface Props {
  onClose: () => void;
  onStart: (players: any[]) => void;
}

export const PassAndPlaySetupModal: React.FC<Props> = ({ onClose, onStart }) => {
  const [playerCount, setPlayerCount] = useState<2 | 3 | 4>(2);
  const [names, setNames] = useState<string[]>(['Player 1', 'Player 2', 'Player 3', 'Player 4']);

  const colors: PlayerColor[] = ['RED', 'GREEN', 'YELLOW', 'BLUE'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const players = Array.from({ length: playerCount }).map((_, i) => ({
      id: `local_${i + 1}`,
      name: names[i] || `Player ${i + 1}`,
      color: colors[i],
      isAi: false,
    }));
    onStart(players);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-[#0e1a30] border-2 border-yellow-400 rounded-2xl w-full max-w-sm p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-black text-yellow-400">CLASSIC OFFLINE SETUP</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 font-bold block mb-1">SELECT PLAYER COUNT</label>
            <div className="flex gap-2">
              {[2, 3, 4].map((cnt) => (
                <button
                  type="button"
                  key={cnt}
                  onClick={() => setPlayerCount(cnt as 2 | 3 | 4)}
                  className={`flex-1 py-1.5 rounded-lg font-bold text-xs ${
                    playerCount === cnt ? 'bg-yellow-400 text-gray-950' : 'bg-gray-800 text-white'
                  }`}
                >
                  {cnt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {Array.from({ length: playerCount }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: colors[i].toLowerCase() }} />
                <input
                  type="text"
                  value={names[i]}
                  maxLength={12}
                  onChange={(e) => {
                    const next = [...names];
                    next[i] = e.target.value;
                    setNames(next);
                  }}
                  className="flex-1 bg-black/40 border border-gray-700 rounded-lg px-2.5 py-1 text-xs text-white"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-yellow-400 text-gray-950 font-black rounded-xl"
          >
            <Play className="w-4 h-4 fill-current" />
            Play Now
          </button>
        </form>
      </div>
    </div>
  );
};
