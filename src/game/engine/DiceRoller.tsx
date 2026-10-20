import React, { useState } from 'react';
import { audioManager } from '../../services/audio/audioManager';

interface Props {
  value: number | null;
  canRoll: boolean;
  onRoll: () => void;
  playerName: string;
  avatarUrl?: string;
  isTurn: boolean;
}

export const DiceRoller: React.FC<Props> = ({ value, canRoll, onRoll, playerName, avatarUrl, isTurn }) => {
  const [isRolling, setIsRolling] = useState(false);

  const handleRoll = () => {
    if (!canRoll || isRolling) return;
    setIsRolling(true);
    audioManager.playDiceRoll();

    setTimeout(() => {
      setIsRolling(false);
      onRoll();
    }, 450);
  };

  const renderPips = (num: number) => {
    const pips: Record<number, number[]> = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8],
    };
    const activePips = pips[num] || [4];

    return (
      <div className="grid grid-cols-3 grid-rows-3 gap-1 w-8 h-8 p-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex items-center justify-center">
            {activePips.includes(i) && (
              <span className="w-2 h-2 bg-gray-900 rounded-full shadow-inner" />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex items-center gap-2">
      {/* Player Avatar */}
      <div className="flex flex-col items-center">
        <div className={`relative w-12 h-12 rounded-xl border-2 overflow-hidden shadow-md ${isTurn ? 'border-yellow-400' : 'border-gray-600'}`}>
          <img
            src={avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-[11px] font-bold text-gray-200 mt-0.5 truncate max-w-[60px]">{playerName}</span>
      </div>

      {/* Yellow Active Turn Pointer Arrow from Video */}
      {isTurn && (
        <span className="text-yellow-400 text-sm font-black animate-pulse">▶</span>
      )}

      {/* "Go" Dice Roller Box */}
      <button
        onClick={handleRoll}
        disabled={!canRoll}
        className={`relative w-14 h-14 rounded-2xl flex items-center justify-center border-2 shadow-xl transition-all ${
          canRoll
            ? 'bg-gradient-to-b from-amber-400 to-yellow-500 border-yellow-300 text-black font-black scale-105 shadow-yellow-500/50'
            : 'bg-gradient-to-b from-white to-gray-200 border-gray-400 text-gray-700'
        } ${isRolling ? 'rotate-180 scale-95 duration-300' : ''}`}
      >
        {isRolling ? (
          <span className="text-xs font-black animate-spin">🎲</span>
        ) : value ? (
          renderPips(value)
        ) : (
          <span className="font-extrabold text-sm tracking-wide">Go</span>
        )}
      </button>
    </div>
  );
};
