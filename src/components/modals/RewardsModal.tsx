import React, { useState } from 'react';
import { X, Gift, Check, Flame } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { audioManager } from '../../services/audio/audioManager';

export const RewardsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { updateCoins } = useAuthStore();
  const [claimedDay, setClaimedDay] = useState<number | null>(null);

  const streakDays = [
    { day: 1, coins: 20 },
    { day: 2, coins: 35 },
    { day: 3, coins: 50 },
    { day: 4, coins: 75 },
    { day: 5, coins: 100 },
    { day: 6, coins: 150 },
    { day: 7, coins: 300 },
  ];

  const handleClaim = (day: number, coins: number) => {
    if (claimedDay !== null) return;
    setClaimedDay(day);
    updateCoins(coins);
    audioManager.playVictory();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0e1a30] border-2 border-yellow-400 rounded-2xl w-full max-w-sm p-4 shadow-2xl">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h2 className="text-sm font-black text-yellow-400">DAILY REWARD STREAK</h2>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        <p className="text-xs text-gray-300 mb-3">
          Log in daily to claim virtual coins. Reach Day 7 for the Grand Coin Chest!
        </p>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {streakDays.map((s) => {
            const isClaimed = claimedDay === s.day;
            return (
              <button
                key={s.day}
                onClick={() => handleClaim(s.day, s.coins)}
                disabled={claimedDay !== null}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                  isClaimed
                    ? 'bg-green-600/30 border-green-400'
                    : 'bg-[#15233e] border-yellow-500/30 hover:border-yellow-400'
                }`}
              >
                <span className="text-[10px] text-gray-400 font-bold">Day {s.day}</span>
                <Gift className="w-4 h-4 text-yellow-400 my-1" />
                <span className="text-xs font-mono font-bold text-yellow-300">+{s.coins}</span>
                {isClaimed && <Check className="w-3 h-3 text-green-400 mt-1" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
