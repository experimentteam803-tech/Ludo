import React, { useState } from 'react';
import { audioManager } from '../../services/audio/audioManager';

interface Props {
  value: number | null;
  canRoll: boolean;
  onRoll: () => void;
  colorName: string;
}

export const DiceRoller: React.FC<Props> = ({ value, canRoll, onRoll, colorName }) => {
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
      <div className="grid grid-cols-3 grid-rows-3 gap-1 w-10 h-10 p-1.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex items-center justify-center">
            {activePips.includes(i) && (
              <span className="w-2.5 h-2.5 bg-gray-900 rounded-full shadow-inner" />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        onClick={handleRoll}
        disabled={!canRoll}
        className={`relative w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-b from-white to-gray-200 border-2 border-yellow-400 shadow-xl transition-all duration-150 active:scale-95 ${
          canRoll ? 'animate-bounce shadow-yellow-500/50' : 'opacity-80'
        } ${isRolling ? 'rotate-180 scale-105' : ''}`}
      >
        {value ? renderPips(value) : <span className="font-bold text-gray-500 text-xs">ROLL</span>}
      </button>
      <span className="text-[11px] font-bold text-yellow-300 uppercase tracking-wider">{colorName}</span>
    </div>
  );
};
