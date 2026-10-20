import React, { useState, useEffect } from 'react';
import { Gift, Zap } from 'lucide-react';

export const PromoBanner: React.FC<{ onClaimFree: () => void }> = ({ onClaimFree }) => {
  const slides = [
    { title: 'REGISTER & GET 100/- FREE', desc: 'Virtual Coins Instant Bonus', action: 'Claim Bonus' },
    { title: 'REFER AND EARN 50/-', desc: 'Invite Friends & Multiply Coins', action: 'Share Link' },
    { title: 'WATCH 2 ADS FOR FREE PASS', desc: 'Unlock Tournament Rooms Free', action: 'Watch & Unlock' }
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % slides.length), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="px-3 pt-2">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 p-3 shadow-lg border border-yellow-300">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[#0d1b2a] font-black text-sm">
              <Zap className="w-4 h-4 fill-current text-white" />
              {slides[index].title}
            </div>
            <p className="text-[11px] text-yellow-950 font-semibold">{slides[index].desc}</p>
          </div>
          <button
            onClick={onClaimFree}
            className="flex items-center gap-1 bg-[#0d1b2a] text-yellow-400 px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-md hover:bg-black transition-all"
          >
            <Gift className="w-3.5 h-3.5" />
            {slides[index].action}
          </button>
        </div>
      </div>
    </div>
  );
};
