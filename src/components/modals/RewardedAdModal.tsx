import React, { useState } from 'react';
import { X, Film, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

export const RewardedAdModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [completedCount, setCompletedCount] = useState(0);
  const [isWatching, setIsWatching] = useState(false);
  const { updateCoins } = useAuthStore();

  const handleSimulateWatch = () => {
    setIsWatching(true);
    // Emulate 2.5s network verified ad watch
    setTimeout(() => {
      setIsWatching(false);
      const next = completedCount + 1;
      setCompletedCount(next);

      if (next >= 2) {
        updateCoins(50);
        alert('Reward verified! Free match pass + 50 virtual coins awarded.');
        onClose();
      }
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-[#0e1a30] border-2 border-yellow-400 rounded-2xl w-full max-w-sm p-4 text-center">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-black text-yellow-400">UNLOCK FREE PASS</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        <p className="text-xs text-gray-300 mb-4">
          Complete 2 verified rewarded sponsor views to unlock a free tournament match without virtual coins.
        </p>

        {/* Progress circles */}
        <div className="flex justify-center gap-6 my-4">
          {[1, 2].map((step) => (
            <div key={step} className="flex flex-col items-center gap-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                  completedCount >= step
                    ? 'border-green-400 bg-green-500/20 text-green-400'
                    : 'border-gray-700 bg-gray-900 text-gray-500'
                }`}
              >
                {completedCount >= step ? <CheckCircle className="w-6 h-6" /> : <Film className="w-6 h-6" />}
              </div>
              <span className="text-[10px] font-bold text-gray-400">Ad {step}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleSimulateWatch}
          disabled={isWatching}
          className="w-full py-2.5 bg-yellow-400 text-gray-950 font-black rounded-xl shadow-lg disabled:opacity-50"
        >
          {isWatching ? 'Verifying Sponsor Ad...' : `Watch Ad (${completedCount}/2)`}
        </button>
      </div>
    </div>
  );
};
